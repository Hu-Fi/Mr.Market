//
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GrowdataExchangeDto,
  GrowdataSimplyGrowTokenDto,
  GrowdataMarketMakingPairDto,
  GrowdataArbitragePairDto,
} from 'src/modules/admin/growdata/adminGrow.dto';
import { AdminGrowService } from 'src/modules/admin/growdata/adminGrow.service';
import { AdminStrategyService } from 'src/modules/admin/strategy/adminStrategy.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CustomLogger } from 'src/modules/logger/logger.service';

@ApiTags('admin/grow')
@Controller('admin/grow')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminGrowController {
  private readonly logger = new CustomLogger(AdminGrowController.name);
  constructor(
    private readonly adminGrowService: AdminGrowService,
    private readonly adminStrategyService: AdminStrategyService,
  ) {}
  // Admin growdata endpoints
  // Exchange endpoints
  @Post('exchange/add')
  @ApiOperation({ summary: 'Add a new exchange' })
  @ApiBody({ type: GrowdataExchangeDto })
  async addExchange(@Body() exchangeDto: GrowdataExchangeDto) {
    return this.adminGrowService.addExchange(exchangeDto);
  }

  @Get('exchange/supported')
  @ApiOperation({ summary: 'Get supported exchanges by backend' })
  async getSupportedExchanges() {
    try {
      // The reason why we use adminStrategyService is because it's under admin module
      // so it can access the exchangeInitService without importing it
      const supportedExchanges =
        await this.adminStrategyService.getSupportedExchanges();
      return {
        code: HttpStatus.OK,
        data: supportedExchanges,
      };
    } catch (error) {
      this.logger.error(
        'Failed to retrieve supported exchanges',
        error.message,
      );
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving supported exchanges: ${error.message}`,
      };
    }
  }

  @Delete('exchange/remove/:exchange_id')
  @ApiOperation({ summary: 'Remove an exchange' })
  async removeExchange(@Param('exchange_id') exchange_id: string) {
    return this.adminGrowService.removeExchange(exchange_id);
  }

  @Delete('exchange/remove-all')
  @ApiOperation({ summary: 'Remove all exchanges' })
  async removeAllExchanges() {
    return this.adminGrowService.removeAllExchanges();
  }

  @Post('exchange/update/:exchange_id')
  @ApiOperation({ summary: 'Update an exchange' })
  @ApiBody({ type: GrowdataExchangeDto })
  async updateExchange(
    @Param('exchange_id') exchange_id: string,
    @Body() modifications: Partial<GrowdataExchangeDto>,
  ) {
    return this.adminGrowService.updateExchange(exchange_id, modifications);
  }
  // SimplyGrow token endpoints
  @Post('simply-grow/add')
  @ApiOperation({ summary: 'Add a new SimplyGrow token' })
  @ApiBody({ type: GrowdataSimplyGrowTokenDto })
  async addSimplyGrowToken(@Body() tokenDto: GrowdataSimplyGrowTokenDto) {
    return this.adminGrowService.addSimplyGrowToken(tokenDto);
  }

  @Delete('simply-grow/remove/:asset_id')
  @ApiOperation({ summary: 'Remove a SimplyGrow token' })
  async removeSimplyGrowToken(@Param('asset_id') asset_id: string) {
    return this.adminGrowService.removeSimplyGrowToken(asset_id);
  }

  @Delete('simply-grow/remove-all')
  @ApiOperation({ summary: 'Remove all SimplyGrow tokens' })
  async removeAllSimplyGrowTokens() {
    return this.adminGrowService.removeAllSimplyGrowTokens();
  }

  @Post('simply-grow/update/:asset_id')
  @ApiOperation({ summary: 'Update a SimplyGrow token' })
  @ApiBody({ type: GrowdataSimplyGrowTokenDto })
  async updateSimplyGrowToken(
    @Param('asset_id') asset_id: string,
    @Body() modifications: Partial<GrowdataSimplyGrowTokenDto>,
  ) {
    return this.adminGrowService.updateSimplyGrowToken(asset_id, modifications);
  }

  // Market making pair endpoints
  @Post('market-making/add')
  @ApiOperation({ summary: 'Add a new market making pair' })
  @ApiBody({ type: GrowdataMarketMakingPairDto })
  async addMarketMakingPair(@Body() pairDto: GrowdataMarketMakingPairDto) {
    return this.adminGrowService.addMarketMakingPair(pairDto);
  }

  @Delete('market-making/remove/:id')
  @ApiOperation({ summary: 'Remove a market making pair' })
  async removeMarketMakingPair(@Param('id') id: string) {
    return this.adminGrowService.removeMarketMakingPair(id);
  }

  @Delete('market-making/remove-all')
  @ApiOperation({ summary: 'Remove all market making pairs' })
  async removeAllMarketMakingPairs() {
    return this.adminGrowService.removeAllMarketMakingPairs();
  }

  @Post('market-making/update/:id')
  @ApiOperation({ summary: 'Update a market making pair' })
  @ApiBody({ type: GrowdataMarketMakingPairDto })
  async updateMarketMakingPair(
    @Param('id') id: string,
    @Body() modifications: Partial<GrowdataMarketMakingPairDto>,
  ) {
    return this.adminGrowService.updateMarketMakingPair(id, modifications);
  }

  // Arbitrage pair endpoints
  @Post('arbitrage/add')
  @ApiOperation({ summary: 'Add a new arbitrage pair' })
  @ApiBody({ type: GrowdataArbitragePairDto })
  async addArbitragePair(@Body() pairDto: GrowdataArbitragePairDto) {
    return this.adminGrowService.addArbitragePair(pairDto);
  }

  @Delete('arbitrage/remove/:id')
  @ApiOperation({ summary: 'Remove an arbitrage pair' })
  async removeArbitragePair(@Param('id') id: string) {
    return this.adminGrowService.removeArbitragePair(id);
  }

  @Delete('arbitrage/remove-all')
  @ApiOperation({ summary: 'Remove all arbitrage pairs' })
  async removeAllArbitragePairs() {
    return this.adminGrowService.removeAllArbitragePairs();
  }

  @Post('arbitrage/update/:id')
  @ApiOperation({ summary: 'Update an arbitrage pair' })
  @ApiBody({ type: GrowdataArbitragePairDto })
  async updateArbitragePair(
    @Param('id') id: string,
    @Body() modifications: Partial<GrowdataArbitragePairDto>,
  ) {
    return this.adminGrowService.updateArbitragePair(id, modifications);
  }
}
