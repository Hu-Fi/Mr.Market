import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { ExchangeService } from './exchange.service';
import { ExchangeDepositDto, ExchangeWithdrawalDto } from './exchange.dto';

// This API is used for admin page to do rebalance
@ApiTags('exchange')
@Controller('exchange')
@UseGuards(JwtAuthGuard)
export class ExchangeController {
  private readonly logger = new CustomLogger(ExchangeController.name);

  constructor(private readonly exchagneService: ExchangeService) {}

  @Post('/withdrawal/create')
  @ApiOperation({ summary: 'Create withdrawal with api key' })
  @ApiResponse({ status: 200, description: 'Create withdrawal' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createWithdrawal(data: ExchangeWithdrawalDto) {
    try {
      return this.exchagneService.createWithdrawal(data);
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
      return this.exchagneService.getDepositAddress(data);
    } catch (e) {
      this.logger.error(`Get deposit address error: ${e.message}`);
    }
  }
}
