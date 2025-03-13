import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { User } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.usersRepository.findByEmail(createUserDto.email);
    if (user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'Email already exists',
        },
      });
    }

    return this.usersRepository.createUser({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
    });
  }

  findById(id: User['id']): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  findByEmail(email: User['email']): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }
}
