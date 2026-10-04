import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { MovieSearchResult } from '../../shared/types/movie.interface.js';
import { TvMazeService } from '../tvmaze/tvmaze.service.js';
import { TrendingShow } from './trending-show.entity.js';
import { TmdbService } from '../tmdb/tmdb.service.js';

const CACHE_KEY = 'trending:list';

@Injectable()
export class TrendingService {
  constructor(
    @InjectRepository(TrendingShow)
    private readonly repo: Repository<TrendingShow>,

    private readonly tvMaze: TvMazeService,
    private readonly tmdb: TmdbService,
  ) {}

  async getMovies(): Promise<MovieSearchResult[]> {
    const rows = await this.repo.find({ order: { position: 'ASC' } });
    if (!rows.length) return this.tmdb.getTrending();

    const settled = await Promise.allSettled(
      rows.map((row) => this.tmdb.getShowById(row.showId)),
    );
    const results = settled.flatMap((result, i) =>
      result.status === 'fulfilled'
        ? [{ score: rows.length - i, show: result.value }]
        : [],
    );

    return results;
  }

  async add(showId: number, position?: number) {
    await this.tmdb.getShowById(showId);

    if (await this.repo.existsBy({ showId })) {
      throw new ConflictException('This show is already in trending');
    }

    const last = await this.repo.maximum('position');
    const saved = await this.repo.save(
      this.repo.create({ showId, position: position ?? (last ?? -1) + 1 }),
    );

    return saved;
  }

  async remove(showId: number) {
    const { affected } = await this.repo.delete({ showId });
    if (!affected) throw new NotFoundException('Show not in trending');
  }

  async reorder(showIds: number[]) {
    await this.repo.manager.transaction(async (manager) => {
      for (const [position, showId] of showIds.entries()) {
        await manager.update(TrendingShow, { showId }, { position });
      }
    });
  }

  has(showId: number) {
    return this.repo.existsBy({ showId });
  }
}
