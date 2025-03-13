import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductLikeEntity } from '../entities/product-like.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductLikeRepository extends Repository<ProductLikeEntity> {
  constructor(
    @InjectRepository(ProductLikeEntity)
    private readonly repository: Repository<ProductLikeEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findLike(
    userId: number,
    productId: number,
  ): Promise<ProductLikeEntity | null> {
    return this.repository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
  }

  async addLike(
    user: UserEntity,
    product: ProductEntity,
  ): Promise<ProductLikeEntity> {
    const like = this.repository.create({ user, product });
    return this.repository.save(like);
  }

  async removeLike(like: ProductLikeEntity): Promise<void> {
    await this.repository.remove(like);
  }

  async countLikes(productId: number): Promise<number> {
    return this.repository.count({ where: { product: { id: productId } } });
  }
}
