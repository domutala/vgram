import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SourceMediaType } from './source.entity.js';
import { CreateSourceDto } from './dto/create-source.dto.js';
import { SourceService } from './source.service.js';
import { HasProviderQuery } from './dto/has-provider.query.js';
import { AccessCodeGuard } from '../access-codes/access-code.guard.js';
import { UpdateSourceDto } from './dto/update-source.dto.js';

@Controller('api/source')
export class SourceController {
  constructor(private readonly source: SourceService) {}

  @Post()
  @UseGuards(AccessCodeGuard)
  create(@Body() dto: CreateSourceDto) {
    return this.source.create(dto);
  }

  @Patch(':id')
  @UseGuards(AccessCodeGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSourceDto) {
    return this.source.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AccessCodeGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.source.remove(id);
  }

  @Get()
  findByMedia(
    @Query('mediaType', new ParseEnumPipe(SourceMediaType))
    mediaType: SourceMediaType,
    @Query('databaseId', ParseIntPipe) databaseId: number,
  ) {
    return this.source.findByMedia(mediaType, databaseId);
  }

  @Get('exists')
  async hasProvider(@Query() { provider, databaseId, tvId }: HasProviderQuery) {
    if ((databaseId == null) === (tvId == null)) {
      throw new BadRequestException(
        'Provide exactly one of databaseId or tvId',
      );
    }

    return {
      exists: await this.source.hasProvider(provider, { databaseId, tvId }),
    };
  }
}
