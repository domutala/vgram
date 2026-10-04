import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSourceDto } from './create-source.dto.js';

export class UpdateSourceDto extends PartialType(
  OmitType(CreateSourceDto, ['databaseId', 'mediaType'] as const),
) {}
