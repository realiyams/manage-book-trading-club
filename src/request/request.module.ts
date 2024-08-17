import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtConfigModule } from './../auth/jwt/jwt.module';

import { RequestService } from './request.service';
import { RequestController } from './request.controller';

import { User } from './../entities/user.entity';
import { Book } from './../entities/book.entity';
import { TradeRequest } from './../entities/request.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([TradeRequest]),
    JwtConfigModule,
  ],
  controllers: [RequestController],
  providers: [RequestService]
})
export class RequestModule {}
