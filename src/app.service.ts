import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { title: 'Welcome to Nest.js', message: 'Hello from Nest.js!' };
  }
}
