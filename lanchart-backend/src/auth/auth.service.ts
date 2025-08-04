

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${registerDto.username}`,
    });
    
    const { password, ...result } = user;
    const token = this.jwtService.sign({ username: user.username, sub: user.id });
    
    return { user: result, token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);
    
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.usersService.updateOnlineStatus(user.id, true);
    
    const { password, ...result } = user;
    const token = this.jwtService.sign({ username: user.username, sub: user.id });
    
    return { user: result, token };
  }

  async logout(userId: number) {
    await this.usersService.updateOnlineStatus(userId, false);
    return { message: 'Logged out successfully' };
  }
}







