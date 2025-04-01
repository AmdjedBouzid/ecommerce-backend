import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { registerDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export type Payload = {
  sub: number;
  email: string;
  role: string;
};

@Injectable()
export class AuthService {
  private readonly saltRounds: number;
  private readonly jwtSecret: string;
  private readonly jwtExpiration: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtExpiration =
      this.configService.get<string>('JWT_EXPIRATION') || '7d';
    const saltRounds = this.configService.get<string>('SALT_ROUNDS');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    if (!saltRounds || isNaN(Number(saltRounds))) {
      throw new Error(
        'SALT_ROUNDS must be a valid number in environment variables',
      );
    }

    this.jwtSecret = jwtSecret;
    this.jwtExpiration = jwtExpiration;
    this.saltRounds = Number(saltRounds);
  }

  generateToken(payload: Payload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiration,
    });
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: Payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateToken(payload);

    return { accessToken };
  }

  async register(createUserDto: registerDto): Promise<{ accessToken: string }> {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    const newUser = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepo.save(newUser);

    const payload: Payload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    };

    const accessToken = this.generateToken(payload);

    return { accessToken };
  }
}
