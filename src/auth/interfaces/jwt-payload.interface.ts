// src/auth/interfaces/jwt-payload.interface.ts
import { Role } from '@/src/common/enums/role.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
}
