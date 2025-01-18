import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpStatus,
  Query,
  Body,
  Post,
} from '@nestjs/common';
import { AdminRebalanceService } from 'src/modules/admin/rebalance/adminRebalance.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('admin/rebalance')
@Controller('admin/rebalance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminRebalanceController {
  constructor(private readonly adminRebalanceService: AdminRebalanceService) {}
  @Get('all-balances')
  @ApiOperation({ summary: 'Get all balances' })
  @ApiResponse({ status: 200, description: 'Balances retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Get all balances error' })
  @ApiQuery({ name: 'disableCache', type: String, required: false })
  async getAllBalances(@Query('disableCache') disableCache: string) {
    try {
      const result = await this.adminRebalanceService.getAllBalances(
        disableCache,
      );
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (e) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving balances: ${e.message}`,
      };
    }
  }

  @Get('history/all')
  @ApiOperation({ summary: 'Get all rebalance history' })
  @ApiResponse({
    status: 200,
    description: 'All rebalance history retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Get rebalance history error' })
  async getAllRebalanceHistory() {
    try {
      const result = await this.adminRebalanceService.getAllRebalanceHistory();
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (e) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving rebalance history: ${e.message}`,
      };
    }
  }

  @Get('balance/exchange/:keyId')
  @ApiOperation({ summary: 'Get balance by key label' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getBalanceByKey(@Param('keyId') keyId: string) {
    try {
      let result;
      if (keyId == '0') {
        result = await this.adminRebalanceService.getBalanceByMixin('map');
      } else {
        result = await this.adminRebalanceService.getBalanceByKey(keyId);
      }
      if (!result) {
        return {
          code: HttpStatus.BAD_REQUEST,
          message: `Balance not found for key label: ${keyId}`,
        };
      }
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (e) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving balance: ${e.message}`,
      };
    }
  }

  @Get('balance/mixin')
  @ApiOperation({ summary: 'Get balance by mixin' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getBalanceByMixin(@Query('type') type: 'map' | 'list') {
    try {
      const result = await this.adminRebalanceService.getBalanceByMixin(type);
      if (!result) {
        return {
          code: HttpStatus.BAD_REQUEST,
          message: `Balance not found for mixin`,
        };
      }
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (e) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving balance: ${e.message}`,
      };
    }
  }

  @Get('/transfer/info')
  @ApiOperation({ summary: 'Get transfer info' })
  @ApiResponse({
    status: 200,
    description: 'Transfer info retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Get transfer info error' })
  async getTransferInfo(@Body() transferDto: any) {
    try {
      const result = await this.adminRebalanceService.getTransferInfo(
        transferDto.fromKeyId,
        transferDto.toKeyId,
        transferDto.symbol,
        transferDto.chain,
      );
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (e) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving transfer info: ${e.message}`,
      };
    }
  }

  @Post('transfer/exchanges')
  @ApiOperation({ summary: 'Transfer between exchanges' })
  @ApiResponse({ status: 200, description: 'Transfer successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Transfer error' })
  async transferBetweenExchanges(
    @Body()
    transferDto: {
      fromKeyId: string;
      toKeyId: string;
      symbol: string;
      chain: string;
      amount: string;
    },
  ) {
    try {
      const result = await this.adminRebalanceService.transferBetweenExchanges(
        transferDto.fromKeyId,
        transferDto.toKeyId,
        transferDto.symbol,
        transferDto.chain,
        transferDto.amount,
      );
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (e) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error transferring between exchanges: ${e.message}`,
      };
    }
  }

  @Post('transfer/mixin-to-exchange')
  @ApiOperation({ summary: 'Transfer from mixin to exchange' })
  @ApiResponse({ status: 200, description: 'Transfer successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Transfer error' })
  async transferFromMixin(
    @Body()
    transferDto: {
      assetId: string;
      amount: string;
      toKeyId: string;
    },
  ) {
    try {
      const result =
        await this.adminRebalanceService.transferFromMixinToExchange(
          transferDto.assetId,
          transferDto.amount,
          transferDto.toKeyId,
        );
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (e) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error transferring from mixin to exchange: ${e.message}`,
      };
    }
  }

  @Post('transfer/exchange-to-mixin')
  @ApiOperation({ summary: 'Transfer from exchange to mixin' })
  @ApiResponse({ status: 200, description: 'Transfer successful' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Transfer error' })
  async transferFromExchange(
    @Body()
    transferDto: {
      fromKeyId: string;
      symbol: string;
      network: string;
      amount: string;
    },
  ) {
    try {
      const result =
        await this.adminRebalanceService.transferFromExchangeToMixin(
          transferDto.fromKeyId,
          transferDto.symbol,
          transferDto.network,
          transferDto.amount,
        );
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (e) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error transferring from exchange to mixin: ${e.message}`,
      };
    }
  }
}
