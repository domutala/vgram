import {
  Controller,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TvMazeService } from './tvmaze/tvmaze.service.js';
import { AdminGuard } from './auth/admin.guard.js';

@Controller('api/admin/cache')
@UseGuards(AdminGuard)
export class CacheController {
  constructor(private readonly tvMazeService: TvMazeService) {}

  // DELETE /admin/cache -> Purge TOUT le cache
  @Delete()
  @HttpCode(HttpStatus.OK)
  async flushAll() {
    return await this.tvMazeService.clearAllCache();
  }

  // DELETE /admin/cache/shows/123 -> Invalide uniquement la série 123 et ses épisodes
  @Delete('shows/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async flushShow(@Param('id') showId: string) {
    await this.tvMazeService.clearShowCache(Number(showId));
  }

  // DELETE /admin/cache/purge?prefix=/shows/123 -> Invalidation par motif/préfixe
  @Delete('purge')
  @HttpCode(HttpStatus.OK)
  async purgeByPrefix(@Query('prefix') prefix: string) {
    const deletedCount = await this.tvMazeService.clearCacheByPrefix(prefix);
    return { deletedKeysCount: deletedCount };
  }
}
