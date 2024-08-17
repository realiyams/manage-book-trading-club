import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtConfigModule } from './../auth/jwt/jwt.module';

import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

import { User } from './../entities/user.entity';
import { Book } from './../entities/book.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Book]),
    JwtConfigModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
