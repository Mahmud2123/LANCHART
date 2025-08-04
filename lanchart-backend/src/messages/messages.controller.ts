import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Message } from './message.entity';
import { Room } from 'src/rooms/room.entity';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async createMessage(
    @Request() req,
    @Body('content') content: string,
    @Body('roomId') roomId: number,
  ) {
    return this.messagesService.create(content, req.user.userId, roomId);
  }

  @Get('room/:roomId')
  async getMessagesByRoom(@Param('roomId') roomId: number) {
    return this.messagesService.findByRoom(roomId);
  }
  
@UseGuards(JwtAuthGuard)
@Get('recent')
async getRecentMessages(@Request() req): Promise<Message[]> {
  return this.messagesService.findRecent(req.user.userId);
}
@UseGuards(JwtAuthGuard)
@Post('private')
async sendPrivateMessage(@Request() req, @Body() body: { recipientId: number; content: string }): Promise<Room> {
  return this.messagesService.createPrivateRoom(req.user.userId, body.recipientId, body.content);
}

}