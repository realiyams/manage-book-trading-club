import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { User } from './../entities/user.entity';
import { Book } from './../entities/book.entity';
import { TradeRequest } from './../entities/request.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(TradeRequest)
    private TradeRequestRepository: Repository<TradeRequest>,
  ) { }

  async getBooksOwnedByUser(userId: number): Promise<Book[]> {
    return this.bookRepository.find({
      where: { giver: { id: userId } },
    });
  }

  async getAvailableBooksNotOwnedByUser(userId: number): Promise<Book[]> {
    const books = await this.bookRepository.find({
      where: {
        giver: { id: Not(userId) },
        isAvailable: true,
      },
      relations: ['giver'],
    });

    return books.map(book => {
      if (book.giver) {
        delete book.giver.password;
      }
      return book;
    });
  }
  
}
