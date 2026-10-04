import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { TvMazeService } from '../tvmaze/tvmaze.service.js';
import {
  Movie,
  MovieSearchResult,
  MovieEpisode,
} from '../../shared/types/movie.interface.js';
import { SourceService } from '../source/source.service.js';
import { Source, SourceMediaType } from '../source/source.entity.js';
import { TrendingService } from '../trending/trending.service.js';
import { TmdbService } from '../tmdb/tmdb.service.js';

@Controller('api/movie')
export class MovieController {
  constructor(
    private readonly tvMazeService: TvMazeService,
    private readonly tmdbService: TmdbService,
    private readonly sourceService: SourceService,
    private readonly trending: TrendingService,
  ) {}

  private async withSources<T extends { id: number }>(
    episodes: T[],
  ): Promise<(T & { sources: Source[] })[]> {
    const grouped = await this.sourceService.findByDatabaseIds(
      SourceMediaType.EPISODE,
      episodes.map((e) => e.id),
    );
    return episodes.map((e) => ({ ...e, sources: grouped.get(e.id) ?? [] }));
  }

  /**
   * GET /shows/search?q=girls
   * Recherche des séries par nom
   */
  @Get('search')
  async searchShows(@Query('q') query: string): Promise<MovieSearchResult[]> {
    if (!query?.trim()) return this.trending.getMovies();
    return await this.tmdbService.searchShows(query);
  }

  /**
   * GET /shows/139
   * Récupère les détails d'une série par son ID
   */
  @Get(':id')
  async getShowById(@Param('id', ParseIntPipe) id: number): Promise<Movie> {
    return await this.tmdbService.getShowById(id);
  }

  /**
   * GET /shows/139/episodes
   * Récupère la liste des épisodes d'une série
   */
  @Get(':id/episodes')
  async getShowEpisodes(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MovieEpisode[]> {
    return this.withSources(await this.tmdbService.getShowEpisodes(id));
  }

  /**
   * GET /shows/139/full
   * Récupère les détails de la série ET ses épisodes en une seule réponse
   */
  @Get(':id/full')
  async getShowWithEpisodes(@Param('id', ParseIntPipe) id: number) {
    const [show, episodes] = await Promise.all([
      this.tmdbService.getShowById(id),
      this.tmdbService.getShowEpisodes(id),
    ]);

    return { ...show, episodes: await this.withSources(episodes) };
  }
}
