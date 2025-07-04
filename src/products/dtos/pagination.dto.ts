// src/common/dto/pagination.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
