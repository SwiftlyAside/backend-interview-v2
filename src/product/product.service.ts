import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './domain/product';
import { ProductMapper } from './mapper/product.mapper';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductLikeRepository } from './repositories/product-like.repository';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductLikeRepository)
    private readonly productLikeRepository: ProductLikeRepository,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const productEntity = this.productRepository.create(createProductDto);
    const product = await this.productRepository.save(productEntity);
    return ProductMapper.toDomain(product);
  }

  async findAll(filters: any, sort: any): Promise<Product[]> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (filters.brand) {
      queryBuilder.andWhere('product.brand = :brand', { brand: filters.brand });
    }

    if (filters.color) {
      queryBuilder.andWhere('product.color = :color', { color: filters.color });
    }

    if (filters.size) {
      queryBuilder.andWhere('product.size = :size', { size: filters.size });
    }

    if (sort === 'price_asc') {
      queryBuilder.orderBy('product.price', 'ASC');
    } else if (sort === 'price_desc') {
      queryBuilder.orderBy('product.price', 'DESC');
    } else if (sort === 'name_asc') {
      queryBuilder.orderBy('product.name', 'ASC');
    } else if (sort === 'name_desc') {
      queryBuilder.orderBy('product.name', 'DESC');
    }

    const products = await queryBuilder.getMany();
    return products.map((product) => ProductMapper.toDomain(product));
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return ProductMapper.toDomain(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    let product = await this.productRepository.findOne({ where: { id } });
    product = { ...product, ...updateProductDto };
    const updatedProduct = await this.productRepository.save(product);
    return ProductMapper.toDomain(updatedProduct);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    await this.productRepository.remove(product);
  }

  async toggleLike(user: { id: number }, productId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingLike = await this.productLikeRepository.findLike(
      user.id,
      productId,
    );

    if (existingLike) {
      await this.productLikeRepository.removeLike(existingLike);
    } else {
      const userEntity = new UserEntity();
      userEntity.id = user.id;
      await this.productLikeRepository.addLike(userEntity, product);
    }
  }

  async getLikesCount(productId: number): Promise<number> {
    return this.productLikeRepository.countLikes(productId);
  }
}
