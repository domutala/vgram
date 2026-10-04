import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, randomBytes } from 'node:crypto';
import { Repository } from 'typeorm';
import { AccessCode } from './access-code.entity.js';

const hash = (code: string) => createHash('sha256').update(code).digest('hex');

@Injectable()
export class AccessCodesService {
  constructor(
    @InjectRepository(AccessCode) private readonly repo: Repository<AccessCode>,
  ) {}

  async create(label: string, expiresAt?: Date) {
    const code = randomBytes(24).toString('base64url');
    const saved = await this.repo.save(
      this.repo.create({
        label,
        codeHash: hash(code),
        expiresAt: expiresAt ?? null,
      }),
    );
    return { id: saved.id, label, expiresAt: saved.expiresAt, code };
  }

  async validate(code: string): Promise<AccessCode | null> {
    if (!code) return null;

    const found = await this.repo.findOneBy({
      codeHash: hash(code),
      isActive: true,
    });
    if (!found || (found.expiresAt && found.expiresAt < new Date()))
      return null;

    void this.repo.update(found.id, { lastUsedAt: new Date() });
    return found;
  }

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async setActive(id: string, isActive: boolean) {
    const { affected } = await this.repo.update(id, { isActive });
    if (!affected) throw new NotFoundException('Access code not found');
  }
}
