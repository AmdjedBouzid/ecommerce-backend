import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categorys/entities/category.entity';
import { productImage } from './entities/productImages.entity'; // optional if used explicitly
import { UpdateProductDto } from './dtos/update-product-dto';
import { PaginationDto } from './dtos/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(productImage)
    private readonly productImageRepository: Repository<productImage>,
  ) {}

  async create(body: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: { id: body.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${body.categoryId} not found`,
      );
    }
    const existingProduct = await this.productRepository.findOne({
      where: {
        name: body.name,
        category: { id: body.categoryId },
      },
      relations: ['category'],
    });
    if (existingProduct) {
      throw new ConflictException(
        `Product with name "${body.name}" already exists in this category.`,
      );
    }
    const product = this.productRepository.create({
      name: body.name,
      price: body.price,
      description: body.description,
      stock: body.stock,
      category,
      images: body.imageUrl.map((url) => ({ url })),
    });

    return await this.productRepository.save(product);
  }
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id }, // Ensure we only fetch non-deleted products
      relations: ['category', 'images'], // eager loading of related entities
    });

    if (!product) {
      throw new NotFoundException(`No product with this id: ${id}`);
    }

    return product;
  }

  async find(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['category', 'images'],
      where: { isDeleted: false }, // Ensure we only fetch non-deleted products
    });
    return products;
  }
  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['category', 'images'],
    });
    return products;
  }
  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'images'], // so we can access current state if needed
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${dto.categoryId} not found`,
        );
      }
      product.category = category;
    }

    Object.assign(product, {
      name: dto.name ?? product.name,
      description: dto.description ?? product.description,
      price: dto.price ?? product.price,
      stock: dto.stock ?? product.stock,
    });

    return await this.productRepository.save(product);
  }
  async addImages(
    productId: number,
    imageUrls: string[],
  ): Promise<{ id: number; url: string }[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const newImages = imageUrls.map((url) => {
      const image = new productImage();
      image.url = url;
      image.product = product; // associate with the product
      return image;
    });

    if (newImages.length === 0) {
      throw new ConflictException('No images provided to add');
    }

    // Save and return only id and url
    return (await this.productImageRepository.save(newImages)).map((image) => ({
      id: image.id,
      url: image.url,
    }));
  }

  async deleteImages(
    productId: number,
    imageIds?: number[],
  ): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['images'], // load related images
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (imageIds && imageIds.length > 0) {
      const validImageIds = product.images
        .filter((image) => imageIds.includes(image.id))
        .map((image) => image.id);

      if (validImageIds.length === 0) {
        throw new NotFoundException(
          `No matching images found for product ${productId}`,
        );
      }

      await this.productImageRepository.delete(validImageIds);

      return {
        message: `Deleted ${validImageIds.length} image(s) for product ${productId}`,
      };
    } else {
      // Delete all images of the product
      await this.productImageRepository.delete({ product: { id: productId } });

      return { message: `All images deleted for product ${productId}` };
    }
  }

  // src/products/product.service.ts
  async getProductsWithPagination(paginationDto: PaginationDto): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    message: string;
  }> {
    const { page = 1, limit = 10, categoryId, search } = paginationDto;

    const take = +limit;
    const skip = (+page - 1) * take;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.isDeleted = :isDeleted', { isDeleted: false }) // ✅ Soft delete filter
      .skip(skip)
      .take(take);

    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page: +page,
      limit: take,
      message: 'Products fetched successfully',
    };
  }

  async delete(id: number): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.update(id, { isDeleted: true });

    return { message: `Product with ID ${id} deleted successfully` };
  }
}
