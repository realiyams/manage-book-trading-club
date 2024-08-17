import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './../entities/user.entity';
import { Book } from './../entities/book.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtConfigModule } from './../auth/jwt/jwt.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Book]),
    JwtConfigModule,
  ],
  controllers: [ProfileController], // Import controller ke dalam modul
  providers: [ProfileService], // Import service ke dalam modul
})
export class ProfileModule {}
