/* eslint-disable prettier/prettier */
// signin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SigninController } from './signin.controller';
import { SigninService } from './signin.service';

import { User } from './../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SigninController],
  providers: [SigninService],
})
export class SigninModule { }
