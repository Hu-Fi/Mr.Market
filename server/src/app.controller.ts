import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { execSync } from 'child_process';
import { getRFC3339Timestamp } from './common/helpers/utils';

@Controller()
@ApiTags('General')
export class AppController {
  private readonly appHash: string;

  constructor(private readonly configService: ConfigService) {
    try {
      this.appHash = execSync('git rev-parse HEAD').toString().trim();
    } catch (e) {
      this.appHash = 'unknown';
    }
  }

  @Get('')
  @ApiOperation({ summary: 'Get server information' })
  @ApiResponse({ status: 200, description: 'Return server information.' })
  getAppInfo() {
    return {
      mixin_app_id: this.configService.get<string>('mixin.app_id'),
      app_hash: this.appHash,
      recording_oracle_url: this.configService.get<string>(
        'hufi.recording_oracle.api_url',
      ),
      campaign_launcher_url: this.configService.get<string>(
        'hufi.campaign_launcher.api_url',
      ),
      timestamp: getRFC3339Timestamp(),
    };
  }

  @Get('docs')
  @Redirect('/docs', 302)
  @ApiOperation({ summary: 'Redirect to docs' })
  @ApiResponse({ status: 200, description: 'Redirect to docs.' })
  redirectToDocs() { }
}
