import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'; // Import Swagger decorators
import { AuthService } from 'src/modules/auth/auth.service';
import { CustomLogger } from '../logger/logger.service';

@ApiTags('Mixin')
@Controller('auth')
export class AuthController {
  private readonly logger = new CustomLogger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({
    description: 'Login with password',
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          example: '',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'JWT access token' })
  async login(
    @Body('password') password: string,
  ): Promise<{ access_token: string }> {
    const access_token = await this.authService.validateUser(password);
    return { access_token };
  }

  @Get('oauth')
  @ApiQuery({ name: 'code', required: true, description: 'OAuth code' }) // Define query parameter
  @ApiResponse({ status: 200, description: 'OAuth handler response' })
  async oauth(@Query('code') code: string) {
    return this.authService.mixinOauthHandler(code);
  }
}
