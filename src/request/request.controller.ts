import { Controller, Get, Render, Request, Res } from '@nestjs/common';
import { RequestService } from './request.service';

@Controller()
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get('create-request')
  getNewRequest(@Request() req, @Res() res) {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    
    return res.render('requests/createRequest', {
      isAuthenticated: true,
      user: req.session.user,
    });
  }

  @Get('book/select-gives')
  @Render('requests/selectGives')
  async getSelectBookGives(@Request() req) {
    const user = req.session.user;
    if (!user) {
      return { redirect: '/login' };
    }
    const books = await this.requestService.getBooksOwnedByUser(user.id);

    return { books, isAuthenticated: true, user };
  }

  @Get('book/select-takes')
  @Render('requests/selectTakes')
  async getSelectBookTakes(@Request() req) {
    const user = req.session.user;
    if (!user) {
      return { redirect: '/login' };
    }
    const books = await this.requestService.getAvailableBooksNotOwnedByUser(user.id);

    return { books, isAuthenticated: true, user };
  }
}
