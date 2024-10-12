import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './../entities/user.entity';
import { Book } from './../entities/book.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) { }

  async getUserProfile(userId: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateUserProfile(
    userId: number,
    userData: Partial<User>,
  ): Promise<User> {
    const result = await this.userRepository.update({ id: userId }, userData);

    if (result.affected === 0) {
      throw new Error('User not found');
    }

    return this.userRepository.findOne({ where: { id: userId } });
  }

  async getUserBooks(userId: number): Promise<Book[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['books', 'books.receiver', 'books.tradeRequestAsRequested'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.books;
  }

  async addBookToUser(userId: number, bookData: Partial<Book>): Promise<Book> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const newBook = this.bookRepository.create(bookData);
    newBook.giver = user;
    newBook.receiver = null;
    newBook.isAvailable = true;

    await this.bookRepository.save(newBook);

    return newBook;
  }

  async deleteBookFromUser(userId: number, bookId: number): Promise<void> {
    const book = await this.bookRepository.findOne({
      where: { id: bookId, giver: { id: userId } },
    });

    if (!book) {
      throw new Error('Book not found');
    }

    await this.bookRepository.remove(book);
  }
}
