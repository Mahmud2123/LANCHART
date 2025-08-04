import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Room } from '../rooms/room.entity';

@Injectable()
export class MessagesService {
  [x: string]: any;
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async create(content: string, userId: number, roomId: number): Promise<Message> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const room = await this.roomsRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const message = this.messagesRepository.create({
      content,
      user,
      room,
    });
    return this.messagesRepository.save(message);
  }

  async findByRoom(roomId: number): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { room: { id: roomId } },
      relations: ['user', 'room'],
      order: { timestamp: 'ASC' },
    });
  }

 async findRecent(userId: number): Promise<Message[]> {
  return this.messagesRepository.find({
    where: { user: { id: userId } },
    relations: ['user', 'room'],
    order: { timestamp: 'DESC' },
    take: 3,
  });
}

async createPrivateRoom(senderId: number, recipientId: number, content: string): Promise<Room> {
  const sender = await this.usersRepository.findOne({ where: { id: senderId } });
  const recipient = await this.usersRepository.findOne({ where: { id: recipientId } });
  if (!sender || !recipient) {
    throw new NotFoundException('User not found');
  }

  const room = this.roomsRepository.create({
    name: `DM: ${sender.username} & ${recipient.username}`,
    description: 'Private conversation',
    creatorId: senderId,
  });
  await this.roomsRepository.save(room);

  const message = this.messagesRepository.create({
    content,
    user: sender,
    room,
  });
  await this.messagesRepository.save(message);

  return room;
}
}