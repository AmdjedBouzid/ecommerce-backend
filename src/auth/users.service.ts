import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepo.find();
  }
  getCurrentUser(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: id } });
  }
}
