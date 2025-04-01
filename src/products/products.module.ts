import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { productImage } from './entities/productImages.entity';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { Category } from '../categorys/entities/category.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Product, productImage, Category])],
  controllers: [ProductsController],
  providers: [ProductService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
