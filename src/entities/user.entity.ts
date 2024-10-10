/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Book } from './book.entity';
import { TradeRequest } from './request.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  fullName: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => Book, book => book.giver)
  books: Book[];

  @OneToMany(() => Book, book => book.receiver)
  receivedBooks: Book[];

  @OneToMany(() => TradeRequest, tradeRequest => tradeRequest.requester)
  sentTradeRequests: TradeRequest[];

  @OneToMany(() => TradeRequest, tradeRequest => tradeRequest.responder)
  receivedTradeRequests: TradeRequest[];
}


