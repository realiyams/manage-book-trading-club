import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';

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
    private tradeRequestRepository: Repository<TradeRequest>,
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
  async createTradeRequest(userId: number, tradeRequestData: any): Promise<TradeRequest> {

    const booksToGive = JSON.parse(tradeRequestData.booksToGive);
    const booksToTake = JSON.parse(tradeRequestData.booksToTake);

    const requester = await this.userRepository.findOne({ where: { id: userId } });
    const responder = await this.userRepository.findOne({ where: { id: booksToTake[0].giver.id } });

    const tradeRequest = new TradeRequest();
    tradeRequest.requester = requester;
    tradeRequest.responder = responder;
    tradeRequest.isAccepted = false;

    tradeRequest.offeredBooks = await this.bookRepository.findBy({
      id: In(booksToGive.map((book: { id: any; }) => book.id)),
    });

    tradeRequest.requestedBooks = await this.bookRepository.findBy({
      id: In(booksToTake.map((book: { id: any; }) => book.id)),
    });

    return this.tradeRequestRepository.save(tradeRequest);
  }

  async getAllTradeRequests(): Promise<TradeRequest[]> {
    return this.tradeRequestRepository.find({
      relations: ['requester', 'responder', 'offeredBooks', 'requestedBooks'],
    });
  }

  // New method to get "respond requests"
  async getRespondRequests(userId: number): Promise<TradeRequest[]> {
    return this.tradeRequestRepository.find({
      where: {
        responder: { id: userId },
      },
      relations: ['requester', 'responder', 'offeredBooks', 'requestedBooks'],
    });
  }

  async acceptTradeRequest(tradeRequestId: number, responderId: number): Promise<void> {
    const tradeRequest = await this.tradeRequestRepository.findOne({
      where: { id: tradeRequestId, responder: { id: responderId } },
      relations: ['requester', 'responder', 'offeredBooks', 'requestedBooks'],
    });

    if (!tradeRequest) {
      throw new Error('Trade request not found or unauthorized');
    }

    tradeRequest.isAccepted = true;
    tradeRequest.respondedAt = new Date();

    // Update offered books - mark them as unavailable and set the receiver
    await Promise.all(tradeRequest.offeredBooks.map(async (book) => {
      book.isAvailable = false;
      book.receiver = tradeRequest.responder; // Set the responder as the receiver
      return this.bookRepository.save(book);
    }));

    // Update requested books - mark them as unavailable and set the receiver
    await Promise.all(tradeRequest.requestedBooks.map(async (book) => {
      book.isAvailable = false;
      book.receiver = tradeRequest.requester; // Set the requester as the receiver
      return this.bookRepository.save(book);
    }));

    await this.tradeRequestRepository.save(tradeRequest);
  }

  async rejectTradeRequest(tradeRequestId: number, responderId: number): Promise<void> {
    const tradeRequest = await this.tradeRequestRepository.findOne({
      where: { id: tradeRequestId, responder: { id: responderId } },
    });

    if (!tradeRequest) {
      throw new Error('Trade request not found or unauthorized');
    }

    tradeRequest.respondedAt = new Date();
    await this.tradeRequestRepository.remove(tradeRequest); // Delete the trade request on reject
  }
}
