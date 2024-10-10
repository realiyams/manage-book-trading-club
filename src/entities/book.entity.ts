/* eslint-disable prettier/prettier */
// src/entities/book.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';
import { TradeRequest } from './request.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => User, user => user.books)
  @JoinColumn({ name: 'giver_id' })
  giver: User;

  @ManyToOne(() => User, user => user.receivedBooks, { nullable: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User | null;

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => TradeRequest, tradeRequest => tradeRequest.requestedBooks, { nullable: true })
  @JoinColumn({ name: 'trade_request_id' })
  tradeRequestAsRequested: TradeRequest | null;

  @ManyToOne(() => TradeRequest, tradeRequest => tradeRequest.offeredBooks, { nullable: true })
  @JoinColumn({ name: 'trade_request_id' })
  tradeRequestAsOffered: TradeRequest | null;
}

