import { Module } from '@nestjs/common';
   import { TypeOrmModule } from '@nestjs/typeorm';
   import { ConfigModule, ConfigService } from '@nestjs/config';
   import { AuthModule } from './auth/auth.module';
   import { UsersModule } from './users/users.module';
   import { RoomsModule } from './rooms/rooms.module';
   import { MessagesModule } from './messages/messages.module';
   import { ChatModule } from './chat/chat.module';
   import { User } from './users/user.entity';
   import { Room } from './rooms/room.entity';
   import { Message } from './messages/message.entity';
   import { MulterModule } from '@nestjs/platform-express';
import { MessagesController } from './messages/messages.controller';

   @Module({
     imports: [
       ConfigModule.forRoot(),
       TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: (configService: ConfigService) => ({
           type: 'sqlite',
           database: configService.get<string>('DATABASE_URL') || 'lanchart.db',
           entities: [User, Room, Message],
           synchronize: true, // For development only
         }),
       }),
       MulterModule.register({ dest: './Uploads' }),
       AuthModule,
       UsersModule,
       RoomsModule,
       MessagesModule,
       ChatModule,
     ],
     controllers:[MessagesController]
   })
   export class AppModule {}