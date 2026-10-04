// trending/trending.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessCodesModule } from '../access-codes/access-codes.module.js';
import { TvMazeModule } from '../tvmaze/tvmaze.module.js';
import { TrendingController } from './trending.controller.js';
import { TrendingShow } from './trending-show.entity.js';
import { TrendingService } from './trending.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrendingShow]),
    AccessCodesModule,
    TvMazeModule,
  ],
  controllers: [TrendingController],
  providers: [TrendingService],
  exports: [TrendingService],
})
export class TrendingModule {}
