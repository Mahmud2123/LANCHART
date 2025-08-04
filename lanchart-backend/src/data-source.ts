import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Room } from './rooms/room.entity';
import { Message } from './messages/message.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'lanchart.db',
  entities: [User, Room, Message],
  migrations: ['migrations/*.ts'],
  synchronize: false, // Set to false for migrations
});