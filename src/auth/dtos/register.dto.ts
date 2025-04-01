// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';

export type UserRole = 'admin' | 'user';

export class registerDto {
  @IsEmail()
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'user'], { message: 'role must be either admin or user' })
  role?: UserRole; // Optional for security, unless only admins can assign roles

  @IsOptional()
  @IsString()
  profileImg?: string;
}
