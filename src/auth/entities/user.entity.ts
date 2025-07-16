//create user entity
import { Entity, PrimaryGeneratedColumn, Column, In } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@/src/common/enums/role.enum';
import { Exclude } from 'class-transformer';
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
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  profileImg?: string; // Optional field for user profile image
}
