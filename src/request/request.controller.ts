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

  @Post('submit-trade-request')
  async submitTradeRequest(@Body() body, @Request() req, @Res() res) {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/login');
    }

    const userId = user.id;
    const tradeRequestData = body;

    // Create the trade request
    await this.requestService.createTradeRequest(userId, tradeRequestData);

    // Redirect to 'requests/allRequest.hbs'
    return res.redirect('/requests');
  }
  @Get('requests')
  async getAllRequests(@Request() req, @Res() res) {
    const user = req.session.user;
    // Fetch all trade requests related to the user (you can customize this logic)
    const allRequests = await this.requestService.getAllTradeRequests();
    
    if (!user) {
      return res.render('requests/allRequest', {
        tradeRequests: allRequests,
      });
    }
    // Render the 'requests/allRequest.hbs' view, passing user and request data
    return res.render('requests/allRequest', {
      isAuthenticated: true,
      user,
      tradeRequests: allRequests,
    });
  }

  @Get('respond-requests')
  async getRespondRequests(@Request() req, @Res() res) {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/login');
    }

    const respondRequests = await this.requestService.getRespondRequests(user.id);
    console.log(respondRequests);

    return res.render('requests/respondRequest', {
      isAuthenticated: true,
      user,
      respondRequests,
    });
  }

  @Post('requests/accept')
  async acceptTradeRequest(@Body('tradeRequestId') tradeRequestId: number, @Request() req, @Res() res) {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/login');
    }

    // Handle the logic for accepting the trade request
    await this.requestService.acceptTradeRequest(tradeRequestId, user.id);

    // Redirect to the response page after action
    return res.redirect('/respond-requests');
  }

  @Post('requests/reject')
  async rejectTradeRequest(@Body('tradeRequestId') tradeRequestId: number, @Request() req, @Res() res) {
    const user = req.session.user;
    if (!user) {
      return res.redirect('/login');
    }

    // Handle the logic for rejecting the trade request
    await this.requestService.rejectTradeRequest(tradeRequestId, user.id);

    // Redirect to the response page after action
    return res.redirect('/respond-requests');
  }
}
