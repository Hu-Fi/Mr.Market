// auth.service.ts
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  secret: string;
  adminPassword: string;
  constructor(private jwtService: JwtService, private configService: ConfigService) {
    this.secret = this.configService.get<string>('admin.jwt_secret');
    this.adminPassword = this.configService.get<string>('admin.pass');

    if (!this.secret) {
      throw `AuthService initalization failed: Invalid jwt secret in .env`;
    }
    if (!this.adminPassword) {
      throw `AuthService initalization failed: Invalid admin password in .env`;
    }
  }

  async validateUser(password: string): Promise<string> {

    if (!this.adminPassword || !password) {
      throw new UnauthorizedException('Password is required');
    }

    const hashedAdminPassword = createHash('sha3-256')
      .update(this.adminPassword)
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
