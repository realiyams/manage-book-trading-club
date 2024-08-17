import { Controller, Get, Render, Request } from '@nestjs/common';
import { BookService } from './book.service';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('books')
  @Render('books/book')
  async getBooks(@Request() req) {
    req.flash(); // Inisialisasi req.flash

    // Tampilkan pesan flash hanya jika flag belum disetel
    if (req.session.user && !req.session.flashShown) {
      req.flash('success', 'Welcome a user!');
      req.session.flashShown = true; // Set flag setelah menampilkan pesan flash
    }

    const availableBooks = await this.bookService.findAllAvailableBooks();

    return {
      isAuthenticated: req.session.user ? true : false,
      user: req.session.user ? req.session.user : null,
      books: availableBooks,
      messages: req.flash(), // Tambahkan pesan flash ke dalam konteks
    };
  }
}
