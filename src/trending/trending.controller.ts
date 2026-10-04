import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessCodeGuard } from '../access-codes/access-code.guard.js';
import { AddTrendingDto, ReorderTrendingDto } from './dto/trending.dto.js';
import { TrendingService } from './trending.service.js';

@Controller('api/trending')
export class TrendingController {
  constructor(private readonly trending: TrendingService) {}

  @Get('exists')
  async exists(@Query('movieId', ParseIntPipe) movieId: number) {
    return { exists: await this.trending.has(movieId) };
  }

  @Post()
  @UseGuards(AccessCodeGuard)
  add(@Body() dto: AddTrendingDto) {
    return this.trending.add(dto.showId, dto.position);
  }

  @Put('order')
  @HttpCode(204)
  @UseGuards(AccessCodeGuard)
  reorder(@Body() dto: ReorderTrendingDto) {
    return this.trending.reorder(dto.showIds);
  }

  @Delete(':showId')
  @HttpCode(204)
  @UseGuards(AccessCodeGuard)
  remove(@Param('showId', ParseIntPipe) showId: number) {
    return this.trending.remove(showId);
  }
}
