import { Controller, Get, Render, Request } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('users')
  @Render('users/alluser')
  async getBooks(@Request() req) {

    const allUser = await this.usersService.findAll();

    return {
      isAuthenticated: req.session.user ? true : false,
      user: req.session.user ? req.session.user : null,
      allUser: allUser,
    };
  }
}
