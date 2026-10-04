import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Source } from './source.entity.js';
import { SourceService } from './source.service.js';
import { SourceController } from './sources.controller.js';
import { AccessCodesModule } from '../access-codes/access-codes.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Source]), AccessCodesModule],
  controllers: [SourceController],
  providers: [SourceService],
  exports: [SourceService],
})
export class SourceModule {}
