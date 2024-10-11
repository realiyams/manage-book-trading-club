import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradeRequest } from './../entities/request.entity';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(TradeRequest)
    private readonly tradeRequestRepository: Repository<TradeRequest>,
  ) {}

  async findAcceptedTrades(): Promise<TradeRequest[]> {
    return this.tradeRequestRepository.find({
      where: { isAccepted: true },
      relations: ['requester', 'responder', 'requestedBooks', 'offeredBooks'],
    });
  }
}
