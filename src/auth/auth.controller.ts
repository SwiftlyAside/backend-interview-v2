import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public login(@Body() loginDto: AuthLoginDto) {
    return this.authService.validateLogin(loginDto);
  }

  @Post('register')
  public register(@Body() registerDto: AuthRegisterDto) {
    return this.authService.register(registerDto);
  }
}
