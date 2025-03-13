import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createUser(
    data: Partial<Omit<User, 'id' | 'email' | 'password' | 'name'>>,
  ): Promise<User> {
    if (data instanceof User) {
      const persistenceModel = UserMapper.toPersistence(data);
      const user = await this.repository.save(
        this.repository.create(persistenceModel),
      );

      return UserMapper.toDomain(user);
    }

    return null;
  }

  async findById(id: User['id']): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id: Number(id) } });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: User['email']): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });

    return user ? UserMapper.toDomain(user) : null;
  }
}
