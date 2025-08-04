import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async updateOnlineStatus(id: number, isOnline: boolean): Promise<void> {
    await this.usersRepository.update(id, { isOnline });
  }

  async getOnlineUsers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { isOnline: true },
      select: ['id', 'username', 'avatar', 'status'],
    });
  }

  async uploadAvatar(id: number, file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(__dirname, '..', '..', 'Uploads');
    const fileName = `${id}-${Date.now()}${path.extname(file.originalname)}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    const avatarUrl = `/uploads/${fileName}`;
    await this.usersRepository.update(id, { avatar: avatarUrl });
    return avatarUrl;
  }
}