// tmdb/tmdb.service.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { $Fetch, ofetch } from 'ofetch';
import type {
  Movie,
  MovieSearchResult,
  RawMovieEpisode,
} from '../../shared/types/movie.interface.js';
import { MovieProvider } from '../movie/movie.provider.js';

const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const DAY = 86_400_000;
const HOUR = 3_600_000;

const STATUS: Record<string, string> = {
  'Returning Series': 'Running',
  Ended: 'Ended',
  Canceled: 'Ended',
  'In Production': 'In Development',
  Planned: 'In Development',
  Pilot: 'In Development',
};

const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });

function languageName(code: string): string {
  try {
    return languageNames.of(code) ?? '';
  } catch {
    return '';
  }
}

interface TmdbTv {
  id: number;
  name: string;
  type?: string;
  original_language: string;
  genres?: { id: number; name: string }[];
  genre_ids?: number[];
  status?: string;
  homepage?: string;
  vote_average: number;
  poster_path: string | null;
  overview: string;
  popularity: number;
  seasons?: { season_number: number }[];
}

interface TmdbEpisode {
  id: number;
  name: string;
  season_number: number;
  episode_number: number;
  air_date: string | null;
  runtime: number | null;
  still_path: string | null;
  overview: string;
  vote_average: number;
}

interface TmdbPage<T> {
  results: T[];
}

@Injectable()
export class TmdbService implements MovieProvider {
  private readonly client: $Fetch;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    config: ConfigService,
  ) {
    this.client = ofetch.create({
      baseURL: 'https://api.themoviedb.org/3',
      headers: {
        Authorization: `Bearer ${config.getOrThrow<string>('TMDB_ACCESS_TOKEN')}`,
      },
      query: { language: 'fr-FR' },
      retry: 3,
      retryDelay: 1000,
      timeout: 5000,
    });
  }

  private key(endpoint: string, query?: Record<string, any>) {
    return `tmdb:${endpoint}:${JSON.stringify(query || {})}`;
  }

  async get<T = any>(
    endpoint: string,
    query?: Record<string, any>,
    ttl?: number,
  ): Promise<T> {
    const cacheKey = this.key(endpoint, query);

    const cached = await this.cacheManager.get<T>(cacheKey);
    if (cached) return cached;

    const data = await this.client<T>(endpoint, { query });
    await this.cacheManager.set(cacheKey, data, ttl);
    return data;
  }

  // ===== Normalisation =====

  private image(path: string | null): Movie['image'] {
    return path
      ? {
          medium: `${IMAGE_BASE}/w342${path}`,
          original: `${IMAGE_BASE}/original${path}`,
        }
      : null;
  }

  private async genreMap(): Promise<Map<number, string>> {
    const { genres } = await this.get<{
      genres: { id: number; name: string }[];
    }>('/genre/tv/list', undefined, DAY);
    return new Map(genres.map((g) => [g.id, g.name]));
  }

  private toShow(tv: TmdbTv, genreMap?: Map<number, string>): Movie {
    return {
      id: tv.id,
      name: tv.name,
      type: tv.type ?? '',
      language: languageName(tv.original_language),
      genres:
        tv.genres?.map((g) => g.name) ??
        tv.genre_ids?.flatMap((id) => genreMap?.get(id) ?? []) ??
        [],
      status: tv.status ? (STATUS[tv.status] ?? tv.status) : '',
      officialSite: tv.homepage || null,
      rating: { average: tv.vote_average || null },
      image: this.image(tv.poster_path),
      summary: tv.overview?.trim() || null,
      season: 0,
    };
  }

  private toEpisode(ep: TmdbEpisode): RawMovieEpisode {
    return {
      id: ep.id,
      name: ep.name,
      season: ep.season_number,
      number: ep.episode_number,
      airdate: ep.air_date ?? '',
      runtime: ep.runtime ?? 0,
      image: this.image(ep.still_path),
      summary: ep.overview?.trim() || null,
      type: 'regular',
      airtime: '',
      airstamp: '',
      rating: { average: ep.vote_average || null },
    };
  }

  // ===== ShowProvider =====

  async searchShows(query: string): Promise<MovieSearchResult[]> {
    const [page, genres] = await Promise.all([
      this.get<TmdbPage<TmdbTv>>('/search/tv', { query }, 1_800_000),
      this.genreMap(),
    ]);

    return page.results.map((tv) => ({
      score: tv.popularity,
      show: this.toShow(tv, genres),
    }));
  }

  async getTrending(limit = 20): Promise<MovieSearchResult[]> {
    const [page, genres] = await Promise.all([
      this.get<TmdbPage<TmdbTv>>('/trending/tv/week', undefined, HOUR),
      this.genreMap(),
    ]);

    return page.results
      .filter((tv) => tv.poster_path)
      .slice(0, limit)
      .map((tv) => ({ score: tv.popularity, show: this.toShow(tv, genres) }));
  }

  async getShowById(id: number): Promise<Movie> {
    return this.toShow(await this.get<TmdbTv>(`/tv/${id}`, undefined, DAY));
  }

  async getShowEpisodes(showId: number): Promise<RawMovieEpisode[]> {
    const tv = await this.get<TmdbTv>(`/tv/${showId}`, undefined, DAY);
    const seasons = (tv.seasons ?? []).filter((s) => s.season_number > 0);

    const details = await Promise.all(
      seasons.map((s) =>
        this.get<{ episodes: TmdbEpisode[] }>(
          `/tv/${showId}/season/${s.season_number}`,
          undefined,
          DAY,
        ),
      ),
    );

    return details.flatMap((season) =>
      season.episodes.map((ep) => this.toEpisode(ep)),
    );
  }

  // ===== Cache =====

  async clearAllCache(): Promise<{ message: string }> {
    await this.cacheManager.clear();
    return { message: 'Le cache global a été entièrement purgé.' };
  }

  async clearCache(
    endpoint: string,
    query?: Record<string, any>,
  ): Promise<void> {
    await this.cacheManager.del(this.key(endpoint, query));
  }

  async clearShowCache(showId: number): Promise<void> {
    const tv = await this.cacheManager.get<TmdbTv>(this.key(`/tv/${showId}`));

    await Promise.all([
      this.clearCache(`/tv/${showId}`),
      ...(tv?.seasons ?? []).map((s) =>
        this.clearCache(`/tv/${showId}/season/${s.season_number}`),
      ),
    ]);
  }
}
