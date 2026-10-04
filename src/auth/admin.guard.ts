import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly expected: Buffer;

  constructor(config: ConfigService) {
    this.expected = Buffer.from(config.getOrThrow<string>('ADMIN_KEY'));
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization ?? '';
    const code = Buffer.from(header.replace(/^Bearer\s+/i, '').trim());

    if (
      code.length !== this.expected.length ||
      !timingSafeEqual(code, this.expected)
    ) {
      throw new UnauthorizedException('Invalid admin code');
    }
    return true;
  }
}
