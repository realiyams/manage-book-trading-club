import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TradeRequest } from './../entities/request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TradeRequest]),
  ],
  controllers: [TradeController],
  providers: [TradeService]
})
export class TradeModule { }
