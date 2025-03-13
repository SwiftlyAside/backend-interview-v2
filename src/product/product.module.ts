import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductEntity } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductLikeEntity } from './entities/product-like.entity';
import { ProductLikeRepository } from './repositories/product-like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductLikeEntity])],
  controllers: [ProductController],
  providers: [ProductService, ProductLikeRepository],
})
export class ProductModule {}
