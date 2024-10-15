import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: ['books', 'receivedTradeRequests'],
    });

    // Calculate available books count for each user
    return users.map(user => ({
      ...user,
      availableBooksCount: user.books.filter(book => book.isAvailable).length,
    }));
  }
}