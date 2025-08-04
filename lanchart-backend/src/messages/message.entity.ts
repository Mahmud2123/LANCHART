import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => User, user => user.messages)
  user: User;

  @ManyToOne(() => Room, room => room.messages)
  room: Room;
}