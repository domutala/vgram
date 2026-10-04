import { ArrayUnique, IsArray, IsInt, IsOptional, Min } from 'class-validator';

export class AddTrendingDto {
  @IsInt()
  @Min(1)
  showId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}

export class ReorderTrendingDto {
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  showIds: number[];
}
