import {
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { AdminSettingsService } from './adminSettings.service';
import { CustomConfigDto } from './adminSettings.dto';

@ApiTags('admin/settings')
@Controller('admin/settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get('spot-fee')
  async getSpotFee() {
    try {
      const result = await this.adminSettingsService.getSpotFee();
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Get('all')
  async getAllSettings() {
    try {
      const result = await this.adminSettingsService.getAllSettings();
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Post('update')
  async updateSettings(@Body() body: CustomConfigDto) {
    try {
      const result = await this.adminSettingsService.updateSettings(body);
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
