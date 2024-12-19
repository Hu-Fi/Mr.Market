import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpStatus,
  Query,
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

  @Get('balance/:keyLabel')
  @ApiOperation({ summary: 'Get balance by key label' })
  @ApiResponse({ status: 200, description: 'Balance retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getBalanceByKeyLabel(@Param('keyLabel') keyLabel: string) {
    try {
      const result = await this.adminRebalanceService.getBalanceByKeyLabel(
        keyLabel,
      );
      if (!result) {
        return {
          code: HttpStatus.BAD_REQUEST,
          message: `Balance not found for key label: ${keyLabel}`,
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
}
