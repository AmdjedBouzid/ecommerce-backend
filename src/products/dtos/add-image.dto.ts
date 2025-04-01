import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
  ArrayNotEmpty,
} from 'class-validator';

export class AddImagesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({}, { each: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  imageUrls: string[];
}
