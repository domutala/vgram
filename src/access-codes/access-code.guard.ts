import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AccessCode } from './access-code.entity.js';
import { AccessCodesService } from './access-codes.service.js';

@Injectable()
export class AccessCodeGuard implements CanActivate {
  constructor(private readonly codes: AccessCodesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request & { accessCode?: AccessCode }>();
    const code = (req.headers.authorization ?? '')
      .replace(/^Bearer\s+/i, '')
      .trim();

    const found = await this.codes.validate(code);
    if (!found)
      throw new UnauthorizedException('Invalid or disabled access code');

    req.accessCode = found;
    return true;
  }
}
