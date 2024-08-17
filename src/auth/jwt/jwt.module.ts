/* eslint-disable prettier/prettier */
// jwt.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MyJwtService } from './jwt.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'supersecretjwt', // Ganti dengan kunci rahasia Anda
      signOptions: { expiresIn: '1h' }, // Optional: Konfigurasi waktu kadaluarsa token
    }),
  ],
  providers: [MyJwtService, JwtAuthGuard],
  exports: [JwtModule, MyJwtService],
})
export class JwtConfigModule {}
