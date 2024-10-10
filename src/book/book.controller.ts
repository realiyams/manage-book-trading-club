import { Controller, Get, Render, Request } from '@nestjs/common';

import { BookService } from './book.service';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('books')
  @Render('books/book')
  async getBooks(@Request() req) {
    req.flash();

    if (req.session.user && !req.session.flashShown) {
      req.flash('success', 'Welcome a user!');
      req.session.flashShown = true;
    }

    const availableBooks = await this.bookService.findAllAvailableBooks();

    return {
      isAuthenticated: req.session.user ? true : false,
      user: req.session.user ? req.session.user : null,
      books: availableBooks,
      messages: req.flash(),
    };
  }
}
