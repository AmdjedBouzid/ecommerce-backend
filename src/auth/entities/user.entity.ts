//create user entity
import { Entity, PrimaryGeneratedColumn, Column, In } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export type UserRole = 'admin' | 'user';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  email: string;

  @Column()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: UserRole;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  profileImg?: string; // Optional field for user profile image
}
