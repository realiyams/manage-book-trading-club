/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Request, Res } from '@nestjs/common';
import { Response } from 'express';

import { SigninService } from './signin.service';

@Controller()
export class SigninController {
  constructor(private readonly signinService: SigninService) { }

  @Get('signin')
  async getSignin(@Request() req, @Res() res) {
    if (req.session.user) {
      return res.redirect('/');
    }
    res.render('signin');
  }

  @Post('signin')
  async postSignin(
    @Body() userData: { fullname: string; username: string; password: string },
    @Request() req,
    @Res() res: Response,
  ) {
    const { fullname, username, password } = userData;
    try {
      await this.signinService.createUser(fullname, username, password);
      req.flash('success', 'Signin successful! Please log in with your newly registered credentials.');
      res.redirect('/login');
    } catch (error) {
      console.log(error);
      req.flash('error', 'Error! Username has already been taken');
      res.redirect('/signin');
    }
  }
}

