// src/orders/orders.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';
import { AddOrderDto } from './dtos/add-order.dto';
import { Product } from '../products/entities/product.entity';
import { DeliveryCompany } from './entities/delivery-company.entity';
import { OrderStatus } from './enums/order-status.enum';
import { RejectOrderDto } from './dtos/reject-order.dto';
import { OrderPaginationDto } from './dtos/order-pagination.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(DeliveryCompany)
    private readonly deliveryCompanyRepo: Repository<DeliveryCompany>,
  ) {}

  async addOrder(dto: AddOrderDto): Promise<Order> {
    const orderItems: OrderItem[] = [];
    let calculatedProductsTotal = 0;

    // 1. Validate product existence and stock
    let total = 0;
    for (const item of dto.items) {
      const product = await this.productRepo.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }
      total += product.price;

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for product: ${product.name}`,
        );
      }

      const orderItem = this.orderItemRepo.create({
        product,
        quantity: item.quantity,
      });

      orderItems.push(orderItem);
      calculatedProductsTotal += +product.price * item.quantity;
    }

    // 2. Handle delivery company if needed
    let deliveryCompany: DeliveryCompany | undefined = undefined;
    if (dto.withDelivery && dto.deliveryCompanyId) {
      const foundDeliveryCompany = await this.deliveryCompanyRepo.findOne({
        where: { id: dto.deliveryCompanyId },
      });
      if (!foundDeliveryCompany) {
        throw new NotFoundException('Delivery company not found');
      }
      deliveryCompany = foundDeliveryCompany;
    }

    // 3. Create the Order
    const order = this.orderRepo.create({
      items: orderItems,
      productsTotal: calculatedProductsTotal,
      total: calculatedProductsTotal + (dto.deliveryPrice ?? 0),
      withDelivery: dto.withDelivery,
      deliveryPrice: dto.deliveryPrice,
      state: dto.state,
      municipality: dto.municipality,
      deliveryCompany,
      firstName: dto.firstName,
      familyName: dto.familyName,
      email: dto.email,
      phoneNumbers: dto.phoneNumbers,
      deliveryType: dto.deliveryType,
    });

    const savedOrder = await this.orderRepo.save(order);

    // 4. Update product stock
    for (const item of orderItems) {
      item.product.stock -= item.quantity;
      await this.productRepo.save(item.product);
    }

    return savedOrder;
  }
  checkOrderStatus(order: Order | null): boolean {
    if (!order) throw new NotFoundException('Product Not Found');
    if (
      order.confirmedAt ||
      order.status !== OrderStatus.WAITING ||
      order.rejectedAt
    )
      throw new NotFoundException('order alredy confirmed or rejected ');
    return true;
  }
  async acceptOrder(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    this.checkOrderStatus(order);

    order.status = OrderStatus.CONFIRMED;
    order.confirmedAt = new Date();

    return this.orderRepo.save(order);
  }

  async rejectOrder(id: number, dto: RejectOrderDto): Promise<Order | null> {
    const order = await this.orderRepo.findOne({
      where: { id: id },
      relations: ['items', 'items.product', 'deliveryCompany', 'items.order'],
    });
    if (!order) {
      throw new NotFoundException('order not found ');
    }
    console.log(order);

    this.checkOrderStatus(order);
    const orderItems: OrderItem[] = order.items;
    for (const item of orderItems) {
      const product = await this.productRepo.findOne({
        where: { id: item.product.id },
      });
      if (product && typeof product.stock === 'number') {
        product.stock += item.quantity;
        await this.productRepo.save(product);
      }
    }
    order.rejectedAt = new Date();
    order.status = dto.status;
    await this.orderRepo.save(order);
    return this.orderRepo.findOne({
      where: { id: order.id },
      relations: [
        'items.product.images',
        'items.product.category',
        'deliveryCompany',
      ],
    });
  }
  async getOrders(): Promise<Order[]> {
    return await this.orderRepo.find({
      relations: ['items', 'deliveryCompany'],
    });
  }
  async getOrder(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'deliveryCompany'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async getOrdersWithPagination(
    dto: OrderPaginationDto,
  ): Promise<{ data: Order[]; total: number; totalQuery: number }> {
    const { limit = 10, page = 1, status } = dto;

    const where = status ? { status } : {};

    const [data, totalQuery] = await this.orderRepo.findAndCount({
      where,
      relations: [
        'items.product.images',
        'items.product.category',
        'deliveryCompany',
      ],
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    const total = await this.orderRepo.count(); // count all orders regardless of status

    return { data, total, totalQuery };
  }
}
