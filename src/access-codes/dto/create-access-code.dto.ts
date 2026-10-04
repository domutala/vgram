import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateAccessCodeDto {
  @IsString()
  @Length(1, 100)
  label: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
