// auth.controller.ts
import { Throttle } from '@nestjs/throttler';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(
    @Body('password') password: string,
  ): Promise<{ access_token: string }> {
    const access_token = await this.authService.validateUser(password);
    return { access_token };
  }
}
