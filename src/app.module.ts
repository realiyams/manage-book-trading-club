
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from './datasource/typeorm.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { BookModule } from './book/book.module';
import { RequestModule } from './request/request.module';
import { TradeModule } from './trade/trade.module';

@Module({
  imports: [TypeOrmModule, AuthModule, ProfileModule, BookModule, UsersModule, RequestModule, TradeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
