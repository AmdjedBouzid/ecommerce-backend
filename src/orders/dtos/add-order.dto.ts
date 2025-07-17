import { IsString } from 'class-validator';
// src/orders/dto/add-order.dto.ts
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryType } from '../enums/delivery-type.enum';

class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class AddOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsBoolean()
  withDelivery: boolean;

  @IsOptional()
  @IsNumber()
  deliveryPrice?: number;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  municipality?: string;

  @IsOptional()
  @IsNumber()
  deliveryCompanyId?: number;

  @IsOptional()
  @IsString()
  deliveryType?: DeliveryType;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  familyName: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsString({ each: true })
  phoneNumbers: string[];
}
