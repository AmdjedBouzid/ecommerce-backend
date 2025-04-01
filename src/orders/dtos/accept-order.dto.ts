// src/orders/dto/accept-order.dto.ts
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class AcceptOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus.CONFIRMED;
}
