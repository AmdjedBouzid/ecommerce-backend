import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getHome() {
    return 'Your App is running';
  }
}
