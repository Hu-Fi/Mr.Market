import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { ExchangeService } from './exchange.service';
import { ExchangeDepositDto, ExchangeWithdrawalDto } from './exchange.dto';

// This API is used for admin page to do rebalance
@ApiTags('Exchange')
@Controller('exchange')
@UseGuards(JwtAuthGuard)
export class ExchangeController {
  private readonly logger = new CustomLogger(ExchangeController.name);

  constructor(private readonly exchangeService: ExchangeService) { }

  @Post('/withdrawal/create')
  @ApiOperation({ summary: 'Create withdrawal with api key' })
  @ApiResponse({ status: 200, description: 'Create withdrawal' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createWithdrawal(data: ExchangeWithdrawalDto) {
    try {
      return this.exchangeService.createWithdrawal(data);
    } catch (e) {
      this.logger.error(`Create withdrawal error: ${e.message}`);
    }
  }

  @Post('/deposit/create')
  @ApiOperation({ summary: 'Get deposit address with api key' })
  @ApiResponse({ status: 200, description: 'Get deposit address' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getDepositAddress(data: ExchangeDepositDto) {
    try {
      return this.exchangeService.getDepositAddress(data);
    } catch (e) {
      this.logger.error(`Get deposit address error: ${e.message}`);
    }
  }

  @Get('/spot-orders')
  async getAllSpotOrders() {
    return await this.exchangeService.getAllSpotOrders();
  }
}
