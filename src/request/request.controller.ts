import { Controller, Get, Render, Request, Res } from '@nestjs/common';
import { RequestService } from './request.service';

@Controller()
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get('create-request')
  getNewRequest(@Request() req, @Res() res) {
    if (!req.session.user) {
      return res.redirect('/login'); // Redirect ke halaman login jika belum autentikasi
    }
    
    return res.render('requests/createRequest', {
      isAuthenticated: true,
      user: req.session.user,
    });
  }

  @Get('book/select-gives')
  getSelectBookGives() {

  }

  @Get('book/select-takes')
  getSelectBookTakes() {
    
  }
}
