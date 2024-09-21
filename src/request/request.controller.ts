import { Body, Controller, Get, Post, Render, Request, Res } from '@nestjs/common';
import { RequestService } from './request.service';

@Controller()
export class RequestController {
  constructor(private readonly requestService: RequestService) { }

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
    console.log(books);
    console.log(user);
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
    // console.log(books);
    return { books, isAuthenticated: true, user };
  }

  // New POST route to handle trade request submission
  @Post('submit-trade-request')
  async submitTradeRequest(@Body() body, @Request() req, @Res() res) {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/login');
    }

    // Log the data received from the client for debugging
    console.log('Trade Request Data:', body);

    // Return the submitted data for now, without saving it
    return res.render('requests/tradeRequestResult', {
      isAuthenticated: true,
      user,
      submittedData: body,
    });
  }
}
