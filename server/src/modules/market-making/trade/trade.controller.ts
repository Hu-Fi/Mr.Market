import {
  Controller,
  Post,
  Body,
  BadRequestException,
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
import { TradeService } from './trade.service';
import { MarketTradeDto, LimitTradeDto } from './trade.dto';
import { CustomLogger } from '../../infrastructure/logger/logger.service';

@ApiTags('Trading Engine')
@Controller('trade')
export class TradeController {
  private readonly logger = new CustomLogger(TradeController.name);

  constructor(private readonly tradeService: TradeService) { }

  @Post('/market')
  @ApiOperation({ summary: 'Execute a market trade' })
  @ApiResponse({ status: 200, description: 'Trade executed successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid market trade parameters.' })
  async executeMarketTrade(@Body() marketTradeDto: MarketTradeDto) {
    if (
      !marketTradeDto.symbol ||
      !marketTradeDto.side ||
      !marketTradeDto.amount
    ) {
      throw new BadRequestException('Invalid market trade parameters.');
    }

    try {
      const order = await this.tradeService.executeMarketTrade(marketTradeDto);
      this.logger.log(
        `Market trade executed for symbol ${marketTradeDto.symbol}`,
      );
      return order;
    } catch (error) {
      this.logger.error(`Error executing market trade: ${error.message}`);
      throw error; // Re-throw the error for global error handling
    }
  }

  @Post('/limit')
  @ApiOperation({ summary: 'Execute a limit trade' })
  @ApiResponse({ status: 200, description: 'Trade executed successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid limit trade parameters.' })
  async executeLimitTrade(@Body() limitTradeDto: LimitTradeDto) {
    if (
      !limitTradeDto.symbol ||
      !limitTradeDto.side ||
      !limitTradeDto.amount ||
      !limitTradeDto.price
    ) {
      throw new BadRequestException('Invalid limit trade parameters.');
    }

    try {
      const order = await this.tradeService.executeLimitTrade(limitTradeDto);
      this.logger.log(
        `Limit trade executed for symbol ${limitTradeDto.symbol}`,
      );
      return order;
    } catch (error) {
      this.logger.error(`Error executing limit trade: ${error.message}`);
      throw error; // Re-throw the error for global error handling
    }
  }

  @Post('/cancel/:orderId/:symbol')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(
    @Param('orderId') orderId: string,
    @Param('symbol') symbol: string,
  ) {
    return this.tradeService.cancelOrder(orderId, symbol);
  }
}
