import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class DeleteImagesDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  imageIds?: number[];
}
