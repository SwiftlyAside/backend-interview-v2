import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ProductEntity } from './product.entity';

@Entity({
  name: 'product_like',
})
export class ProductLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => UserEntity, (user) => user.productLikes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Index()
  @ManyToOne(() => ProductEntity, (product) => product.likes, {
    onDelete: 'CASCADE',
  })
  product: ProductEntity;
}
