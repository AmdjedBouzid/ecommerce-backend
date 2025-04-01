// src/orders/entities/delivery-company.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class DeliveryCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
