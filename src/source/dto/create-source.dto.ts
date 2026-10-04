import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { SourceMediaType, SourceType } from '../source.entity.js';

export class CreateSourceDto {
  @IsInt()
  @Min(1)
  databaseId: number;

  @IsEnum(SourceMediaType)
  mediaType: SourceMediaType;

  @IsOptional()
  @IsInt()
  @Min(1)
  tvId?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  seasonNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  episodeNumber?: number;

  @IsEnum(SourceType)
  type: SourceType;

  @IsUrl({ require_tld: false })
  url: string;

  @IsString()
  @Length(1, 100)
  provider: string;

  @IsOptional()
  @IsInt()
  providerId?: number;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  language?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subtitles?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 10)
  quality?: string;

  @IsOptional()
  @IsNumberString()
  price?: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
