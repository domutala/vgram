import type {
  Movie,
  MovieSearchResult,
  RawMovieEpisode,
} from '../../shared/types/movie.interface.js';

export interface MovieProvider {
  searchShows(query: string): Promise<MovieSearchResult[]>;
  getTrending(limit?: number): Promise<MovieSearchResult[]>;
  getShowById(id: number): Promise<Movie>;
  getShowEpisodes(showId: number): Promise<RawMovieEpisode[]>;
  clearShowCache(showId: number): Promise<void>;
}

export const SHOW_PROVIDER = Symbol('SHOW_PROVIDER');

export const stripHtml = (html?: string | null): string | null =>
  (html ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim() || null;
