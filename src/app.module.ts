import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './categorys/categorys.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/src/products/entities/product.entity';
import { Category } from '@/src/categorys/entities/category.entity';
import { productImage } from '@/src/products/entities/productImages.entity';
import { dataSourceOptions } from '@/db/data-source';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
@Module({
  imports: [
    ProductsModule,
    CategoryModule,
    AuthModule,
    OrdersModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true, // make it available across all modules
      envFilePath: '.env', // optional, defaults to `.env`
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
