import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @IsString()
  @Length(0, 200)
  description: string;

  creatorId: number; 
}