import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import {
  ExchangeAPIKeysConfigDto,
  ExchangeDepositDto,
  ExchangeWithdrawalDto,
} from 'src/modules/mixin/exchange/exchange.dto';

@ApiTags('admin/exchange')
@Controller('admin/exchange')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminExchangeController {
  private readonly logger = new CustomLogger(AdminExchangeController.name);

  constructor(private readonly exchagneService: ExchangeService) {}

  @Post('withdrawal/create')
  @ApiOperation({ summary: 'Create withdrawal with api key' })
  @ApiResponse({ status: 200, description: 'Create withdrawal' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createWithdrawal(data: ExchangeWithdrawalDto) {
    try {
      const result = await this.exchagneService.createWithdrawal(data);
      return {
        code: HttpStatus.OK,
        message: 'Withdrawal created successfully',
        data: result,
      };
    } catch (e) {
      this.logger.error(`Create withdrawal error: ${e.message}`);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating withdrawal',
        error: e.message,
      };
    }
  }

  @Post('deposit/create')
  @ApiOperation({ summary: 'Get deposit address with api key' })
  @ApiResponse({ status: 200, description: 'Get deposit address' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getDepositAddress(data: ExchangeDepositDto) {
    try {
      const result = await this.exchagneService.getDepositAddress(data);
      return {
        code: HttpStatus.OK,
        message: 'Deposit address retrieved successfully',
        data: result,
      };
    } catch (e) {
      this.logger.error(`Get deposit address error: ${e.message}`);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving deposit address',
        error: e.message,
      };
    }
  }

  @Get('spot-orders')
  async getAllSpotOrders() {
    try {
      const result = await this.exchagneService.getAllSpotOrders();
      return {
        code: HttpStatus.OK,
        message: 'Spot orders retrieved successfully',
        data: result,
      };
    } catch (e) {
      this.logger.error(`Get spot orders error: ${e.message}`);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving spot orders',
        error: e.message,
      };
    }
  }

  @Post('api-key/add')
  @ApiOperation({ summary: 'Add exchange API key' })
  @ApiResponse({ status: 200, description: 'API key added successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async addApiKey(@Body() data: ExchangeAPIKeysConfigDto) {
    try {
      const result = await this.exchagneService.addApiKey(data);
      return {
        code: HttpStatus.OK,
        message: 'API key added successfully',
        data: result,
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error adding API key',
        error: error.message,
      };
    }
  }

  @Get('api-key/all')
  @ApiOperation({ summary: 'Get all exchange API keys' })
  @ApiResponse({
    status: 200,
    description: 'Retrieved all API keys successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getAllApiKeys() {
    try {
      const result = await this.exchagneService.readAllAPIKeys();
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (e) {
      this.logger.error(`Get API keys error: ${e.message}`);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving API keys',
        error: e.message,
      };
    }
  }

  @Post('api-key/remove/:keyId')
  @ApiOperation({ summary: 'Remove exchange API key' })
  @ApiResponse({ status: 200, description: 'API key removed successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async removeApiKey(@Param('keyId') keyId: string) {
    try {
      const result = await this.exchagneService.removeAPIKey(keyId);
      return {
        code: HttpStatus.OK,
        message: 'API key removed successfully',
        data: result,
      };
    } catch (e) {
      this.logger.error(`Remove API key error: ${e.message}`);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error removing API key',
        error: e.message,
      };
    }
  }
}
