import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ofetch, $Fetch } from 'ofetch';
import {
  Movie,
  MovieSearchResult,
  MovieEpisode,
} from '../../shared/types/movie.interface.js';

@Injectable()
export class TvMazeService {
  private client: $Fetch = ofetch.create({
    baseURL: 'https://api.tvmaze.com',
    retry: 3,
    retryDelay: 1000,
    timeout: 5000,
  });

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

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

  async searchShows(query: string): Promise<MovieSearchResult[]> {
    return this.get<MovieSearchResult[]>(
      '/search/shows',
      { q: query },
      1800000,
    );
  }

  async getTrending(limit = 20): Promise<MovieSearchResult[]> {
    const date = new Date().toISOString().slice(0, 10);
    const items = await this.get('/schedule/web', { query: { date } });

    const shows = new Map<number, Movie & { weight?: number }>();
    for (const { _embedded } of items) {
      const show = _embedded?.show;
      if (show?.image) shows.set(show.id, show);
    }

    const results = [...shows.values()]
      .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))
      .slice(0, limit)
      .map((show) => ({ score: show.weight ?? 0, show }));

    return results;
  }

  async getShowById(id: number): Promise<Movie> {
    return this.get<Movie>(`/shows/${id}`, undefined, 86400000);
  }

  async getShowEpisodes(showId: number): Promise<MovieEpisode[]> {
    return this.get<MovieEpisode[]>(
      `/shows/${showId}/episodes`,
      undefined,
      86400000,
    );
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
}
