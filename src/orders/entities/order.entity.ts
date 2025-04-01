// src/orders/entities/order.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { DeliveryCompany } from './delivery-company.entity';
import { OrderItem } from './order-item.entity';
import { DeliveryType } from '../enums/delivery-type.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal')
  productsTotal: number;

  @Column('decimal')
  total: number;

  @Column({ default: false })
  withDelivery: boolean;

  @Column('decimal', { nullable: true })
  deliveryPrice?: number;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  municipality?: string;

  @ManyToOne(() => DeliveryCompany, { nullable: true })
  deliveryCompany?: DeliveryCompany;

  @Column({
    type: 'enum',
    enum: DeliveryType,
    nullable: true,
  })
  deliveryType?: DeliveryType;

  @Column()
  firstName: string;

  @Column()
  familyName: string;

  @Column()
  email: string;

  @Column('simple-array')
  phoneNumbers: string[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.WAITING,
  })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt?: Date;
}
