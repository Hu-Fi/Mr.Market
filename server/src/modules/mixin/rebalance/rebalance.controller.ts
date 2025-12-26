// rebalance.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RebalanceService } from './rebalance.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiTags('Mixin')
@Controller('mixin/rebalance')
@UseGuards(JwtAuthGuard)
export class RebalanceController {
  private readonly logger = new CustomLogger(RebalanceController.name);

  constructor(private readonly rebalanceService: RebalanceService) { }

  @Get('/minimum_balance/all')
  @ApiOperation({ summary: 'Get all minium balance settings' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All minium balance' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async getAllMiniumBalanceSettings() {
    try {
      return await this.rebalanceService.findAllTokensWithExchangesAndBalances();
    } catch (error) {
      this.logger.error(`Failed to get minium balance settings ${error.stack}`);
      throw error;
    }
  }

  @Get('/minimum_balance/exchanges')
  @ApiOperation({ summary: 'Get all exchanges' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All exchanges' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async getAllSupportedExchanges() {
    try {
      return await this.rebalanceService.findAllExchagnes();
    } catch (error) {
      this.logger.error(`Failed to get all supported exchanges ${error.stack}`);
      throw error;
    }
  }

  @Post('/minimum_balance/add')
  @ApiOperation({ summary: 'Add minimum balance setting' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Minimum balance setting added successfully.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  async addMinimumBalanceSetting(
    @Body()
    body: {
      symbol: string;
      assetId: string;
      exchangeName: string;
      minimumBalance: string;
    },
  ) {
    if (
      !body.symbol ||
      !body.assetId ||
      !body.exchangeName ||
      !body.minimumBalance
    ) {
      throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.rebalanceService.addMinimumBalance(
        body.symbol,
        body.assetId,
        body.exchangeName,
        body.minimumBalance,
      );
      return {
        message: 'Minimum balance setting added successfully.',
      };
    } catch (error) {
      this.logger.error(`Failed to add minimum balance: ${error.stack}`);
      throw error;
    }
  }

  @Post('/minimum_balance/update')
  @ApiOperation({ summary: 'Update minimum balance setting' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Minimum balance setting updated successfully.',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @HttpCode(HttpStatus.OK)
  async updateMinimumBalanceSetting(
    @Body()
    body: {
      assetId: string;
      exchangeName: string;
      minimumBalance: string;
    },
  ) {
    if (!body.assetId || !body.exchangeName || !body.minimumBalance) {
      throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.rebalanceService.updateMinimumBalance(
        body.assetId,
        body.exchangeName,
        body.minimumBalance,
      );
      return {
        message: 'Minimum balance setting updated successfully.',
      };
    } catch (error) {
      this.logger.error(`Failed to update minimum balance: ${error.stack}`);
      throw error;
    }
  }
}
