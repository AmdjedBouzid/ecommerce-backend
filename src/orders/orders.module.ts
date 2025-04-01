import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { DeliveryCompany } from './entities/delivery-company.entity';
import { OrderController } from './orders.controller';
import { OrderService } from './orsers.service';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, DeliveryCompany, Product]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
