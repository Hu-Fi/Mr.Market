// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(password: string): Promise<string> {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword || !password) {
      throw new UnauthorizedException('Password is required');
    }

    const hashedAdminPassword = createHash('sha3-256')
      .update(adminPassword)
      .digest('hex');
    const hashedSuppliedPassword = createHash('sha3-256')
      .update(password)
      .digest('hex');

    if (hashedAdminPassword !== hashedSuppliedPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { username: 'admin' };
    return this.jwtService.sign(payload);
  }
}
