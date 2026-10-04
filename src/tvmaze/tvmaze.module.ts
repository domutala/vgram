import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { TvMazeService } from './tvmaze.service.js';

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 3600000, // Durée de vie par défaut : 1 heure (en ms)
      max: 500, // Nombre maximum d'éléments conservés en mémoire
    }),
  ],

  providers: [TvMazeService],
  exports: [TvMazeService],
})
export class TvMazeModule {}
