/* eslint-disable prettier/prettier */
// jwt.service.ts

import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class MyJwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}