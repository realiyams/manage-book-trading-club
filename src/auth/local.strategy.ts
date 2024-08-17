/* eslint-disable prettier/prettier */
// local.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true, // Aktifkan parameter req untuk custom callback
    });
  }

  async validate(req: Request, username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      // Jika autentikasi gagal, kirimkan pesan flash
      throw new UnauthorizedException('Wrong username or password');
    }
    return user;
  }
}
