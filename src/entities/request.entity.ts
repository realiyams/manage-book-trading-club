/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Book } from './book.entity';

@Entity()
export class TradeRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentTradeRequests)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @ManyToOne(() => User, (user) => user.receivedTradeRequests)
  @JoinColumn({ name: 'responder_id' })
  responder: User;

  @OneToMany(() => Book, (book) => book.tradeRequestAsRequested)
  requestedBooks: Book[];

  @OneToMany(() => Book, (book) => book.tradeRequestAsOffered)
  offeredBooks: Book[];

  @Column({ default: false })
  isAccepted: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  respondedAt: Date | null; 
}
