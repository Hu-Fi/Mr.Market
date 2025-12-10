import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FeeService } from './fee.service';

@ApiTags('Market Making')
@Controller('market-making/fees')
export class FeeController {
  constructor(private readonly feeService: FeeService) { }

  @Get('estimate')
  @ApiOperation({ summary: 'Estimate initialization fees' })
  @ApiQuery({ name: 'exchange', type: String })
  @ApiQuery({ name: 'pair', type: String })
  @ApiQuery({
    name: 'direction',
    enum: ['deposit_to_exchange', 'withdraw_to_mixin', 'withdraw_external'],
  })
  async estimateFees(
    @Query('exchange') exchange: string,
    @Query('pair') pair: string,
    @Query('direction')
    direction: 'deposit_to_exchange' | 'withdraw_to_mixin' | 'withdraw_external',
  ) {
    return await this.feeService.calculateMoveFundsFee(
      exchange,
      pair,
      direction,
    );
  }
}
