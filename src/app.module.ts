import { Module, Controller } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './categorys/categorys.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '@/db/data-source';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { AppController } from './app.controller';
@Module({
  controllers: [AppController],
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

  providers: [],
  exports: [],
})
export class AppModule {}
