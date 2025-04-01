import { IsNumber } from 'class-validator';
// src/orders/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './orsers.service';
import { AddOrderDto } from './dtos/add-order.dto';
import { Order } from './entities/order.entity';

import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from '../common/guards/auth.guard';
import { RejectOrderDto } from './dtos/reject-order.dto';
import { OrderPaginationDto } from './dtos/order-pagination.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getOrdersWithPagination(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.orderService.getOrdersWithPagination(orderPaginationDto);
  }
  @Post()
  async addOrder(@Body() dto: AddOrderDto): Promise<Order> {
    return this.orderService.addOrder(dto);
  }

  @Post('accept/:id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async acceptOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.acceptOrder(id);
  }

  @Post('reject/:id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async rejectOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectOrderDto,
  ) {
    return this.orderService.rejectOrder(id, dto);
  }
  @Get()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getOrders() {
    return this.orderService.getOrders();
  }
  @Get(':id')
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrder(id);
  }
}
