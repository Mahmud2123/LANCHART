import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from '../messages/messages.service';
import { RoomsService } from '../rooms/rooms.service';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';
import type { CustomSocket } from '../types/socket'; // Import the custom socket type

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
@UseGuards(WsJwtAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private messagesService: MessagesService,
    private roomsService: RoomsService,
  ) {}

  handleConnection(client: CustomSocket) {
    console.log(`Client connected: ${client.id} (User: ${client.user?.username ?? 'unknown'})`);
    this.server.emit('userConnected', { userId: client.user?.userId });
  }

  handleDisconnect(client: CustomSocket) {
    console.log(`Client disconnected: ${client.id} (User: ${client.user?.username ?? 'unknown'})`);
    this.server.emit('userDisconnected', { userId: client.user?.userId });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: CustomSocket, @MessageBody() roomId: number) {
    const room = await this.roomsService.findById(roomId);
    if (!room) {
      client.emit('error', { message: 'Room not found' });
      return;
    }
    client.join(roomId.toString());
    const messages = await this.messagesService.findByRoom(roomId);
    client.emit('messages', messages);
    this.server
      .to(roomId.toString())
      .emit('userJoined', { userId: client.user?.userId, username: client.user?.username });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: CustomSocket, @MessageBody() roomId: number) {
    client.leave(roomId.toString());
    this.server
      .to(roomId.toString())
      .emit('userLeft', { userId: client.user?.userId, username: client.user?.username });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() data: { content: string; roomId: number },
  ) {
    if (!client.user) {
      client.emit('error', { message: 'Unauthorized' });
      return;
    }
    const message = await this.messagesService.create(data.content, client.user.userId, data.roomId);
    this.server.to(data.roomId.toString()).emit('newMessage', message);
    return message;
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: CustomSocket, @MessageBody() data: { roomId: number; isTyping: boolean }) {
    this.server.to(data.roomId.toString()).emit('userTyping', {
      userId: client.user?.userId,
      username: client.user?.username,
      isTyping: data.isTyping,
    });
  }
}