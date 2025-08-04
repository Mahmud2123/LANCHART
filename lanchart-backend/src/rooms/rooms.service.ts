import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  async findAll(): Promise<Room[]> {
    return this.roomsRepository.find({ where: { isActive: true } });
  }

  async findByCategory(category: string): Promise<Room[]> {
    return this.roomsRepository.find({ 
      where: { category, isActive: true } 
    });
  }

  async findById(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  // async create(roomData: Partial<Room>): Promise<Room> {
  //   const room = this.roomsRepository.create(roomData);
  //   return this.roomsRepository.save(room);
  // }
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomsRepository.create(createRoomDto);
    return this.roomsRepository.save(room);
  }

  async seedRooms(): Promise<void> {
    const existingRooms = await this.roomsRepository.count();
    if (existingRooms === 0) {
      const defaultRooms = [
        { name: 'General Chat', description: 'Welcome to the main chat room!', category: 'General', memberCount: 24, isActive: true },
        { name: 'Tech Talk', description: 'Discuss the latest in technology', category: 'Technology', memberCount: 18, isActive: true },
        { name: 'Random', description: 'Chat about anything and everything', category: 'General', memberCount: 32, isActive: true },
        { name: 'Gaming', description: 'Gamers unite! Discuss your favorite games', category: 'Entertainment', memberCount: 15, isActive: true },
        { name: 'Music Lounge', description: 'Share and discover new music', category: 'Entertainment', memberCount: 21, isActive: true },
        { name: 'Study Group', description: 'Help each other learn and grow', category: 'Education', memberCount: 12, isActive: true },
      ];

      await this.roomsRepository.save(defaultRooms);
    }
  }
}
