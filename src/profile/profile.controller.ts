/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Controller,
  Get,
  Post,
  Render,
  Request,
  UnauthorizedException,
  UseGuards,
  Body,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileService } from './profile.service';

import { User } from './../entities/user.entity';
import { Book } from './../entities/book.entity';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get('profile')
  @Render('profile/profile')
  async getUserProfile(@Request() req) {
    if (!req.session.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.session.user.id;
    const user = await this.profileService.getUserProfile(userId);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      isAuthenticated: true,
      user: user,
    };
  }

  @Get('edit-profile')
  @Render('profile/edit')
  async getUserProfileEdit(@Request() req) {
    if (!req.session.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const userId = req.session.user.id;
    const user = await this.profileService.getUserProfile(userId);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return {
      isAuthenticated: true,
      user: user,
    };
  }

  @Post('edit-profile')
  @UseGuards(AuthGuard('jwt'))
  async postEditProfile(@Body() userData: Partial<User>, @Request() req) {
    try {
      const userId = req.session.user.id;

      if (!userData.username.trim() || !userData.fullName.trim()) {
        throw new BadRequestException('Username and Full Name cannot be empty');
      }

      const updatedUser = await this.profileService.updateUserProfile(
        userId,
        userData,
      );
      req.flash('success', 'Update successful!');
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  }

  @Get('my-books')
  @Render('profile/mybooks')
  async getUserProfileMyBooks(@Request() req) {
    if (!req.session.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    req.flash();

    const userId = req.session.user.id;
    const user = await this.profileService.getUserProfile(userId);
    const userBooks = await this.profileService.getUserBooks(userId);

    console.log(userBooks);

    return {
      isAuthenticated: true,
      user: user,
      userBooks: userBooks,
    };
  }

  @Post('my-books/add')
  @UseGuards(AuthGuard('jwt'))
  async addBookToUserProfile(@Body() bookData: Partial<Book>, @Request() req) {
    try {
      const userId = req.session.user.id;

      if (!bookData.title.trim() || !bookData.description.trim()) {
        throw new BadRequestException('Title and Author cannot be empty');
      }

      const addedBook = await this.profileService.addBookToUser(
        userId,
        bookData,
      );
      req.flash('success', 'Book added successfully!');
      return addedBook;
    } catch (error) {
      throw new Error('Failed to add book');
    }
  }

  @Post('my-books/delete/:bookId')
  @UseGuards(AuthGuard('jwt'))
  async deleteBookFromUserProfile(
    @Param('bookId') bookId: number,
    @Request() req,
  ) {
    try {
      const userId = req.session.user.id;

      await this.profileService.deleteBookFromUser(userId, bookId);
      req.flash('success', 'Book deleted successfully!');
      return { success: true };
    } catch (error) {
      throw new Error('Failed to delete book');
    }
  }
}
