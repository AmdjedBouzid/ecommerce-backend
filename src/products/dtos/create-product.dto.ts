import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
  IsUrl,
  IsArray,
  ArrayNotEmpty,
  MinLength,
} from 'class-validator';
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @MinLength(10)
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  categoryId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  imageUrl: string[];

  @IsNumber()
  @Min(0)
  @Max(10000)
  stock: number;
}
