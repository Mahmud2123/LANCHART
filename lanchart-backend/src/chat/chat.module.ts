import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../messages/messages.module';
import { RoomsModule } from '../rooms/rooms.module';
import { AuthModule } from '../auth/auth.module'; // Add AuthModule

@Module({
  imports: [MessagesModule, RoomsModule, AuthModule], 
  providers: [ChatGateway],
})
export class ChatModule {}