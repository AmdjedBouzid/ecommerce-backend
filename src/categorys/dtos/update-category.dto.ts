import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image: string;
}
