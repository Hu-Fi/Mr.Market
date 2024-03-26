// rebalance.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RebalanceService } from './rebalance.service';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiTags('rebalance')
@Controller('rebalance')
@UseGuards(JwtAuthGuard)
export class RebalanceController {
  private readonly logger = new CustomLogger(RebalanceController.name);

  constructor(private readonly rebalanceService: RebalanceService) {}

  @Get('/minimum_balances')
  @ApiOperation({ summary: 'Get all minium balance settings' })
  @ApiResponse({ status: 200, description: 'Minium balances' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getAllMiniumBalanceSettings() {
    try {
      return await this.rebalanceService.findAllTokensWithExchangesAndBalances();
    } catch (error) {
      this.logger.error(`Failed to get minium balance settings ${error.stack}`);
      throw error;
    }
  }
}
