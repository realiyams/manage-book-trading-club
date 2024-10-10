/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { MyJwtService } from './jwt/jwt.service';

import { User } from './../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: MyJwtService
  ) { }

  async login(user: any): Promise<{ token: string }> {
    const token = this.jwtService.generateToken({ sub: user.id });
    return { token };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (isValidPassword) {
        return user;
      }
    }
    return null;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAdminUser(): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username: 'admin' } });
  }
}

