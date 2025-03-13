import { ProductEntity } from '../entities/product.entity';
import { Product } from '../domain/product';

export class ProductMapper {
  static toDomain(raw: ProductEntity): Product {
    const domainEntity = new Product();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.description = raw.description;
    domainEntity.price = raw.price;
    domainEntity.size = raw.size;
    domainEntity.color = raw.color;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Product): ProductEntity {
    const persistenceEntity = new ProductEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.price = domainEntity.price;
    persistenceEntity.size = domainEntity.size;
    persistenceEntity.color = domainEntity.color;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    return persistenceEntity;
  }
}