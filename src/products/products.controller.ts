import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product-dto';

import { AuthGuard } from '@/src/common/guards/auth.guard';
import { RolesGuard } from '@/src/common/guards/roles.guard';
import { Roles } from '@/src/common/decorators/roles.decorator';
import { Role } from '@/src/common/enums/role.enum';
import { AddImagesDto } from './dtos/add-image.dto';
import { DeleteImagesDto } from './dtos/delete-image.dto';
import { PaginationDto } from './dtos/pagination.dto';

// Require authentication for all routes
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  getProductsWithPagination(@Query() paginationDto: PaginationDto) {
    return this.productService.getProductsWithPagination(paginationDto);
  }
  @Get()
  findAll() {
    return this.productService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() body: CreateProductDto) {
    return this.productService.create(body);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.update(id, body);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post('images/:id')
  addImages(@Param('id', ParseIntPipe) id: number, @Body() dto: AddImagesDto) {
    return this.productService.addImages(+id, dto.imageUrls);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('images/:id')
  deleteImages(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DeleteImagesDto,
  ) {
    return this.productService.deleteImages(id, dto.imageIds);
  }
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Param('id', ParseIntPipe) id: number) {
    return { message: `Product with id ${id} deleted` };
  }
}
//@Query() paginationDto: PaginationDto
