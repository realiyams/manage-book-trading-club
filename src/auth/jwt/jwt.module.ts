/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MyJwtService } from './jwt.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'supersecretjwt',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [MyJwtService, JwtAuthGuard],
  exports: [JwtModule, MyJwtService],
})
export class JwtConfigModule { }
