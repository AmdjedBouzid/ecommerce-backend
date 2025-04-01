import { registerDto } from './dtos/register.dto';
//create class AuthController
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
  @Post('register')
  async register(@Body() createUserDto: registerDto) {
    return this.authService.register(createUserDto);
  }
}
