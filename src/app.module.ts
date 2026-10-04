import { Module } from '@nestjs/common';
import { RunableModule } from 'runable/adapters/nestjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TvMazeModule } from './tvmaze/tvmaze.module.js';
import { MovieController } from './movie.controller.js';
import { SourceModule } from './source/source.module.js';
import { AccessCodesModule } from './access-codes/access-codes.module.js';
import { TrendingModule } from './trending/trending.module.js';
import { TvMazeService } from './tvmaze/tvmaze.service.js';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: 60_000 }),
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        ssl: true,
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: false,
        extra: {
          max: 10,
          idleTimeoutMillis: 30_000,
          connectionTimeoutMillis: 10_000,
        },
      }),
    }),

    TvMazeModule,
    SourceModule,
    TrendingModule,
    AccessCodesModule,

    RunableModule.register(),
  ],

  controllers: [MovieController],
  providers: [TvMazeService],
})
export class AppModule {}
