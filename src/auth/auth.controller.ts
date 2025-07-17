import { registerDto } from './dtos/register.dto';
//create class AuthController
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from './users.service';
import { Auth } from '../common/decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() createUserDto: registerDto) {
    return this.authService.register(createUserDto);
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @Get('users')
  getUsers() {
    return this.usersService.getUsers();
  }
  @Get('users/me')
  @Auth()
  getCurrentUser(@Req() req) {
    return this.usersService.getCurrentUser(req.user.sub);
  }
}
