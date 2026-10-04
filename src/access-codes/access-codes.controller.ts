// access-codes/access-codes.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard.js';
import { AccessCodesService } from './access-codes.service.js';
import { CreateAccessCodeDto } from './dto/create-access-code.dto.js';

@Controller('api/access-codes')
// @UseGuards(AdminGuard)
export class AccessCodesController {
  constructor(private readonly codes: AccessCodesService) {}

  @Post()
  create(@Body() dto: CreateAccessCodeDto) {
    return this.codes.create(
      dto.label,
      dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    );
  }

  @Get()
  list() {
    return this.codes.list();
  }

  @Patch(':id/disable')
  @HttpCode(204)
  disable(@Param('id', ParseUUIDPipe) id: string) {
    return this.codes.setActive(id, false);
  }

  @Patch(':id/enable')
  @HttpCode(204)
  enable(@Param('id', ParseUUIDPipe) id: string) {
    return this.codes.setActive(id, true);
  }
}
