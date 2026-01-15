import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FeeService } from './fee.service';

@ApiTags('Fees')
@Controller('fees')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}
  @Get('info')
  @ApiOperation({ summary: 'Get fee info' })
  async getFeeInfo() {
    // return await this.feeService.getFeeInfo();
    return {};
  }

  @Get('spot-trading/fee')
  @ApiOperation({ summary: 'Get spot trading fees' })
  async getSpotTradingFees(
    @Query('exchange') exchange: string,
    @Query('pair') pair: string,
    @Query('direction')
    direction:
      | 'deposit_to_exchange'
      | 'withdraw_to_mixin'
      | 'withdraw_external',
  ) {
    return await this.feeService.calculateMoveFundsFee(
      exchange,
      pair,
      direction,
    );
  }

  @Get('market-making/fee')
  @ApiOperation({ summary: 'Estimate initialization fees' })
  @ApiQuery({ name: 'exchange', type: String })
  @ApiQuery({ name: 'pair', type: String })
  @ApiQuery({
    name: 'direction',
    enum: ['deposit_to_exchange', 'withdraw_to_mixin', 'withdraw_external'],
  })
  async getMarketMakingFees(
    @Query('exchange') exchange: string,
    @Query('pair') pair: string,
    @Query('direction')
    direction:
      | 'deposit_to_exchange'
      | 'withdraw_to_mixin'
      | 'withdraw_external',
  ) {
    return await this.feeService.calculateMoveFundsFee(
      exchange,
      pair,
      direction,
    );
  }
}
