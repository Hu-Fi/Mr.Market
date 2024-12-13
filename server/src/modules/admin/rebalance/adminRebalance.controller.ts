import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { Controller, Get, Param, UseGuards, HttpStatus } from '@nestjs/common';
import { AdminRebalanceService } from 'src/modules/admin/rebalance/adminRebalance.service';
import {
  ApiBearerAuth,
  ApiOperation,
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
  async getAllBalances() {
    return this.adminRebalanceService.getAllBalances();
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
      return {
        code: HttpStatus.OK,
        message: 'Balance retrieved successfully',
        data: result,
      };
    } catch (e) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving balance',
        error: e.message,
      };
    }
  }
}
