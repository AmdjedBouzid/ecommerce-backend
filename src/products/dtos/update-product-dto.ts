import {
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  IsUrl,
  IsArray,
  ArrayNotEmpty,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000)
  stock?: number;
}
