import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { User } from '../users/domain/user';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async validateLogin(loginDto: AuthLoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnprocessableEntityException('Invalid password');
    }

    const { token, refreshToken, tokenExpiresInMs } = await this.getJwtToken(
      user.id,
    );

    return {
      token,
      refreshToken,
      tokenExpiresInMs,
      user,
    };
  }

  async register(registerDto: AuthRegisterDto) {
    const user = await this.usersService.findByEmail(registerDto.email);

    if (user) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const newUser = await this.usersService.createUser({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });

    const { token, refreshToken, tokenExpiresInMs } = await this.getJwtToken(
      newUser.id,
    );

    return {
      token,
      refreshToken,
      tokenExpiresInMs,
      user: newUser,
    };
  }

  private async getJwtToken(id: User['id']) {
    const tokenExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');

    const tokenExpiresInMs = Date.now() + parseInt(tokenExpiresIn, 10);

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: tokenExpiresInMs,
        },
      ),
      this.jwtService.signAsync(
        { id },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    return { token, refreshToken, tokenExpiresInMs };
  }
}
