import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '@/src/categorys/entities/category.entity';
import { productImage } from '@/src/products/entities/productImages.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text' })
  description: string;

  // ✅ Many-to-One with Category
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'categoryId' }) // creates categoryId column
  category: Category;

  // ✅ One-to-Many with Images
  @OneToMany(() => productImage, (image) => image.product, {
    cascade: true,
    eager: false,
    onDelete: 'CASCADE',
  })
  images: productImage[];

  @Column({ type: 'int' })
  stock: number;
}
