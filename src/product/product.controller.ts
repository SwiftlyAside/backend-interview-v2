import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UserEntity } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

type AuthenticatedRequest = Request & { user: UserEntity };

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  findAll(
    @Query('brand') brand: string,
    @Query('color') color: string,
    @Query('size') size: string,
    @Query('sort') sort: string,
  ) {
    return this.productsService.findAll({ brand, color, size }, sort);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  toggleLike(@Param('id') productId: number, @Req() req: AuthenticatedRequest) {
    return this.productsService.toggleLike(req.user, productId);
  }

  @Get(':id/likes')
  getLikesCount(@Param('id') productId: number) {
    return this.productsService.getLikesCount(productId);
  }
}
