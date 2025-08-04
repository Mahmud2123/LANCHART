
import { IsOptional, IsString, IsEmail, Length } from 'class-validator';

export class UpdateUserDto {


  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  @Length(0, 200)
  bio?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
 
  @IsString()
  @IsOptional()
  @Length(3, 50)
  username?: string;

 

 

  
}
