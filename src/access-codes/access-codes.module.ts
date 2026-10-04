// access-codes/access-codes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGuard } from '../auth/admin.guard.js';
import { AccessCode } from './access-code.entity.js';
import { AccessCodeGuard } from './access-code.guard.js';
import { AccessCodesController } from './access-codes.controller.js';
import { AccessCodesService } from './access-codes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([AccessCode])],
  controllers: [AccessCodesController],
  providers: [AccessCodesService, AccessCodeGuard, AdminGuard],
  exports: [AccessCodesService, AccessCodeGuard],
})
export class AccessCodesModule {}
