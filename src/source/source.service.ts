import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { Source, SourceMediaType } from './source.entity.js';
import { CreateSourceDto } from './dto/create-source.dto.js';
import { UpdateSourceDto } from './dto/update-source.dto.js';

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(Source) private readonly repo: Repository<Source>,
  ) {}

  async create(dto: CreateSourceDto): Promise<Source> {
    if (dto.mediaType === SourceMediaType.EPISODE && dto.tvId == null) {
      throw new BadRequestException('tvId is required for an episode');
    }

    try {
      return await this.repo.save(this.repo.create(dto));
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('This source already exists');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateSourceDto): Promise<Source> {
    const source = await this.repo.findOneBy({ id });
    if (!source) throw new NotFoundException('Source not found');

    try {
      return await this.repo.save(this.repo.merge(source, dto));
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('This source already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const { affected } = await this.repo.delete(id);
    if (!affected) throw new NotFoundException('Source not found');
  }

  async findByDatabaseIds(
    mediaType: SourceMediaType,
    databaseIds: number[],
  ): Promise<Map<number, Source[]>> {
    const grouped = new Map<number, Source[]>();
    if (!databaseIds.length) return grouped;

    const rows = await this.repo.find({
      where: { mediaType, databaseId: In(databaseIds), isActive: true },
      order: { createdAt: 'DESC' },
    });

    for (const row of rows) {
      const list = grouped.get(row.databaseId);
      if (list) list.push(row);
      else grouped.set(row.databaseId, [row]);
    }
    return grouped;
  }

  findByMedia(
    mediaType: SourceMediaType,
    databaseId: number,
  ): Promise<Source[]> {
    return this.repo.find({
      where: { mediaType, databaseId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async hasProvider(
    provider: string,
    target: { databaseId?: number; tvId?: number },
  ): Promise<boolean> {
    const qb = this.repo
      .createQueryBuilder('s')
      .where('LOWER(s.provider) = LOWER(:provider)', { provider })
      .andWhere('s.isActive = true');

    if (target.tvId != null) {
      qb.andWhere('s.mediaType = :mediaType AND s.tvId = :tvId', {
        mediaType: SourceMediaType.EPISODE,
        tvId: target.tvId,
      });
    } else {
      qb.andWhere('s.mediaType = :mediaType AND s.databaseId = :databaseId', {
        mediaType: SourceMediaType.MOVIE,
        databaseId: target.databaseId,
      });
    }

    return qb.getExists();
  }
}
