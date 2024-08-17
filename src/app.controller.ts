import { Controller, Get, Render, Request, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRedirect(@Request() req, @Res() res) {
    return res.redirect('books');
  }
}
