import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Room } from './room.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createRoomDto: CreateRoomDto, @Request() req): Promise<Room> {
    return this.roomsService.create({ ...createRoomDto, creatorId: req.user.userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Room> {
    return this.roomsService.findById(id);
  }
}