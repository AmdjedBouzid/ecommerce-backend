import { Category } from '@/src/categorys/entities/category.entity';
import { Product } from '@/src/products/entities/product.entity';
import { productImage } from '@/src/products/entities/productImages.entity';
import { User } from '@/src/auth/entities/user.entity';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Order } from '@/src/orders/entities/order.entity';
import { OrderItem } from '@/src/orders/entities/order-item.entity';
import { DeliveryCompany } from '@/src/orders/entities/delivery-company.entity';
config({ path: '.env' });
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    Product,
    Category,
    productImage,
    User,
    Order,
    OrderItem,
    DeliveryCompany,
  ],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'production',
};
const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
