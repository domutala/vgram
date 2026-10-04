import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SourceMediaType {
  MOVIE = 'movie',
  EPISODE = 'episode',
}

export enum SourceType {
  STREAMING = 'streaming',
  RENT = 'rent',
  BUY = 'buy',
  FREE = 'free',
  ADS = 'ads',
  DOWNLOAD = 'download',
  TORRENT = 'torrent',
  EMBED = 'embed',
}

@Entity('sources')
@Index(['mediaType', 'databaseId'])
@Index(['mediaType', 'databaseId', 'url'], { unique: true })
@Check(
  `("mediaType" = 'movie' AND "episodeNumber" IS NULL) OR ("mediaType" = 'episode' AND "tvId" IS NOT NULL)`,
)
export class Source {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  databaseId: number;

  @Column({ type: 'enum', enum: SourceMediaType })
  mediaType: SourceMediaType;

  // Episode context (null for movies)
  @Column({ type: 'int', nullable: true })
  tvId: number | null;

  @Column({ type: 'int', nullable: true })
  seasonNumber: number | null;

  @Column({ type: 'int', nullable: true })
  episodeNumber: number | null;

  @Column({ type: 'enum', enum: SourceType })
  type: SourceType;

  @Column({ type: 'text' })
  url: string;

  // e.g."Telegram", "Netflix", "Disney+", "Prime Video"
  @Column({ type: 'varchar', length: 100 })
  provider: string;

  // TMDB watch provider id, if applicable
  @Column({ type: 'int', nullable: true })
  providerId: number | null;

  // ISO 3166-1 (availability region)
  @Column({ type: 'char', length: 2, nullable: true })
  country: string | null;

  // ISO 639-1
  @Column({ type: 'char', length: 2, nullable: true })
  language: string | null;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  subtitles: string[];

  // e.g. "720p", "1080p", "4K"
  @Column({ type: 'varchar', length: 10, nullable: true })
  quality: string | null;

  @Column({ type: 'numeric', precision: 8, scale: 2, nullable: true })
  price: string | null;

  @Column({ type: 'char', length: 3, nullable: true })
  currency: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  lastCheckedAt: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
