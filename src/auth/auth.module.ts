/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { PassportConfig } from './passport.config';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';

import { SigninModule } from './signin/signin.module';

import { LoginController } from './login.controller';

import { User } from './../entities/user.entity';
import { JwtConfigModule } from './jwt/jwt.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    SigninModule,
    JwtConfigModule
  ],
  controllers: [LoginController],
  providers: [PassportConfig, AuthService, LocalStrategy,JwtStrategy],
})
export class AuthModule { }
