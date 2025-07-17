import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ nullable: true })
  image?: string;

  @OneToMany(() => Product, (product) => product.category, {
    onDelete: 'CASCADE',
  })
  products: Product[];
}
