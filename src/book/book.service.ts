import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Book } from './../entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) { }

  async findAllAvailableBooks(): Promise<Book[]> {
    return this.bookRepository.find({
      where: { isAvailable: true, receiver: IsNull() },
      relations: ['giver', 'receiver', 'tradeRequestAsRequested', 'tradeRequestAsOffered'],
    });
  }
}