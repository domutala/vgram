import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ofetch, $Fetch } from 'ofetch';
import {
  Movie,
  MovieSearchResult,
  MovieEpisode,
  RawMovieEpisode,
} from '../../shared/types/movie.interface.js';
import { MovieProvider, stripHtml } from '../movie/movie.provider.js';

@Injectable()
export class TvMazeService implements MovieProvider {
  private client: $Fetch = ofetch.create({
    baseURL: 'https://api.tvmaze.com',
    retry: 3,
    retryDelay: 1000,
    timeout: 5000,
  });

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  private toShow(raw: any): Movie {
    return {
      id: raw.id,
      name: raw.name,
      type: raw.type ?? '',
      language: raw.language ?? '',
      genres: raw.genres ?? [],
      status: raw.status ?? '',
      officialSite: raw.officialSite ?? null,
      rating: { average: raw.rating?.average ?? null },
      image: raw.image
        ? { medium: raw.image.medium, original: raw.image.original }
        : null,
      summary: stripHtml(raw.summary),
      season: 0,
    };
  }

  async get<T = any>(
    endpoint: string,
    query?: Record<string, any>,
    ttl?: number,
  ): Promise<T> {
    const cacheKey = `tvmaze:${endpoint}:${JSON.stringify(query || {})}`;

    const cachedData = await this.cacheManager.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const data = await this.client<T>(endpoint, { query });
    await this.cacheManager.set(cacheKey, data, ttl);

    return data;
  }

  // ==========================================
  // SYSTÈME D'INVALIDATION ET PURGE DU CACHE
  // ==========================================

  /**
   * 1. PURGE GLOBALE : Recommence à zéro en vidant tout le cache mémoire
   */
  async clearAllCache(): Promise<{ message: string }> {
    await this.cacheManager.clear();
    return { message: 'Le cache global a été entièrement purgé.' };
  }

  /**
   * 2. INVALIDATION PONCTUELLE : Supprime une clé spécifique
   */
  async clearCache(
    endpoint: string,
    query?: Record<string, any>,
  ): Promise<void> {
    const cacheKey = `tvmaze:${endpoint}:${JSON.stringify(query || {})}`;
    await this.cacheManager.del(cacheKey);
  }

  /**
   * 3. INVALIDATION CIBLÉE PAR SÉRIE : Supprime à la fois la série et ses épisodes
   */
  async clearShowCache(showId: number): Promise<void> {
    await Promise.all([
      this.clearCache(`/shows/${showId}`),
      this.clearCache(`/shows/${showId}/episodes`),
    ]);
  }

  /**
   * 4. PURGE PAR PRÉFIXE : Supprime toutes les clés commençant par un motif
   * Ex: "tvmaze:/shows/123" purgera les détails, épisodes, casting, etc.
   */
  async clearCacheByPrefix(prefix: string): Promise<number> {
    const store = (this.cacheManager as any).store;

    // Vérifie si le store supporte la récupération de la liste des clés (ex: in-memory ou redis)
    if (store && typeof store.keys === 'function') {
      const keys: string[] = await store.keys(`tvmaze:${prefix}*`);
      await Promise.all(keys.map((key) => this.cacheManager.del(key)));
      return keys.length;
    }

    return 0;
  }

  private toEpisode(raw: any): RawMovieEpisode {
    return {
      id: raw.id,
      name: raw.name,
      season: raw.season,
      number: raw.number ?? 0,
      airdate: raw.airdate ?? '',
      runtime: raw.runtime ?? 0,
      image: raw.image
        ? { medium: raw.image.medium, original: raw.image.original }
        : null,
      summary: stripHtml(raw.summary),
      type: raw.type ?? 'regular',
      airtime: raw.airtime ?? '',
      airstamp: raw.airstamp ?? '',
      rating: { average: raw.rating?.average ?? null },
    };
  }

  async searchShows(query: string): Promise<MovieSearchResult[]> {
    const raw = await this.get<{ score: number; show: any }[]>(
      '/search/shows',
      { q: query },
      1_800_000,
    );
    return raw.map(({ score, show }) => ({ score, show: this.toShow(show) }));
  }

  async getTrending(limit = 20): Promise<MovieSearchResult[]> {
    const date = new Date().toISOString().slice(0, 10);
    const items = await this.get<any[]>('/schedule/web', { date }, 3_600_000);

    const shows = new Map<number, any>();
    for (const { _embedded } of items) {
      const show = _embedded?.show;
      if (show?.image) shows.set(show.id, show);
    }

    return [...shows.values()]
      .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
      .slice(0, limit)
      .map((show) => ({ score: show.weight ?? 0, show: this.toShow(show) }));
  }

  async getShowById(id: number): Promise<Movie> {
    return this.toShow(await this.get(`/shows/${id}`, undefined, 86_400_000));
  }

  async getShowEpisodes(showId: number): Promise<RawMovieEpisode[]> {
    const raw = await this.get<any[]>(
      `/shows/${showId}/episodes`,
      undefined,
      86_400_000,
    );
    return raw.map((ep) => this.toEpisode(ep));
  }
}
