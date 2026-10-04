import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class HasProviderQuery {
  @IsString()
  @Length(1, 100)
  provider: string;

  // Movie
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  databaseId?: number;

  // Series (matches any of its episodes)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  tvId?: number;
}
