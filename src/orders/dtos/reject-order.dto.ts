// src/orders/dto/reject-order.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class RejectOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus.REJECTED_BY_ADMIN | OrderStatus.REJECTED_BY_USER;
}
