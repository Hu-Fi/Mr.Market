import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Controller()
@ApiTags('General')
export class AppController {
  constructor(private readonly configService: ConfigService) { }

  @Get()
  @Redirect('/docs', 302) // Redirect to the '/docs' route with a 302 status code (temporary redirect)
  @ApiOperation({ summary: 'Redirect to docs' })
  @ApiResponse({ status: 200, description: 'Redirect to docs.' })
  redirectToDocs() { }

  @Get('info')
  @ApiOperation({ summary: 'Get server information' })
  @ApiResponse({ status: 200, description: 'Return server information.' })
  getInfo() {
    return {
      mixin_app_id: this.configService.get<string>('mixin.app_id'),
    };
  }
}
