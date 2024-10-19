/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Controller, Get, Post, Render, Request, Res } from '@nestjs/common';
import * as passport from 'passport';
import * as jwt from 'jsonwebtoken';

import { AuthService } from './auth.service';

@Controller()
export class LoginController {
  constructor(private readonly authService: AuthService) { }

  @Get('login')
  async getLogin(@Request() req, @Res() res) {
    if (req.session.user) {
      return res.redirect('/');
    }

    // if (req.hostname === 'localhost') {
    //   const adminUser = await this.authService.findAdminUser();
    //   if (adminUser) {
    //     const token = jwt.sign({ userId: adminUser.id }, 'supersecretjwt', { expiresIn: '1h' });
    //     res.cookie('token', token);
    //     req.session.user = {
    //       id: adminUser.id,
    //       username: adminUser.username,
    //       fullName: adminUser.fullName,
    //     };
    //     return res.redirect('/');
    //   } else {
    //     return res.status(500).send('Admin user not found');
    //   }
    // }

    res.render('login');
  }

  @Post('login')
  async login(@Request() req, @Res() res) {
    try {
      passport.authenticate('local', (err: any, user: any) => {
        if (!user) {
          req.flash('error', 'Error! Wrong username or password');
          return res.redirect('/login');
        }

        const token = jwt.sign({ userId: user.id }, 'supersecretjwt', { expiresIn: '1h' });

        res.cookie('token', token);
        req.session.user = {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
        };

        req.session.flashShown = false;

        return res.redirect('/');
      })(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  } 

  @Get('logout')
  logout(@Request() req, @Res() res) {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).send('Failed to logout');
      }
      res.redirect('/');
    });
  }
}

