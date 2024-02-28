import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Logger,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminPasswordDto } from './admin.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);
  constructor(private readonly tradeService: AdminService) {}

  @Post('/password')
  @ApiOperation({ summary: 'Check password correctness' })
  @ApiResponse({ status: 200, description: 'Password correct.' })
  @ApiBadRequestResponse({ description: 'Incorrect.' })
  async checkPassword(@Body() passDto: AdminPasswordDto) {
    console.log('passDto:', passDto);
    if (!passDto.password) {
      throw new BadRequestException('Invalid parameters.');
    }

    try {
      const correct = await this.tradeService.checkPass(passDto.password);
      this.logger.log(`Admin password attempt: ${passDto.password}`);
      return correct
        ? { status: 200, result: correct }
        : { status: 400, result: correct };
    } catch (error) {
      this.logger.error(`Error checking password: ${error.message}`);
      throw error; // Re-throw the error for global error handling
    }
  }
}
