/* eslint-disable prettier/prettier */
// signin.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './../../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SigninService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(fullname: string, username: string, password: string): Promise<User> {
    
    // Periksa apakah username sudah ada dalam basis data
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Jika username belum ada, buat pengguna baru
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User();
    user.fullName = fullname;
    user.username = username;
    user.password = hashedPassword;
    
    // Simpan pengguna baru ke basis data
    return this.usersRepository.save(user);
  }
}
