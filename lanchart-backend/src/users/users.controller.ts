import { Controller, Get, Put, Body, UseGuards, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as getUserDecorator from '../auth/get-user.decorator';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@getUserDecorator.GetUser() user: getUserDecorator.AuthUser): Promise<User> {
    return this.usersService.findById(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(@getUserDecorator.GetUser() user: getUserDecorator.AuthUser, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('online')
  async getOnlineUsers(): Promise<User[]> {
    return this.usersService.getOnlineUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './Uploads',
        filename: (req, file, cb) => {
          const user = req.user as getUserDecorator.AuthUser;
          const fileName = `${user.userId}-${Date.now()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  async uploadAvatar(@getUserDecorator.GetUser() user: getUserDecorator.AuthUser, @UploadedFile() file: Express.Multer.File): Promise<string> {
    return this.usersService.uploadAvatar(user.userId, file);
  }
}