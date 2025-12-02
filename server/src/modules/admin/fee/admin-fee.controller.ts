import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AdminFeeService } from './admin-fee.service';
import { UpdateGlobalFeeDto } from './admin-fee.dto';

@Controller('admin/fee')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Admin Fee')
export class AdminFeeController {
  constructor(private readonly adminFeeService: AdminFeeService) { }

  @Get('global')
  @ApiOperation({ summary: 'Get global fee settings' })
  async getGlobalFees() {
    return this.adminFeeService.getGlobalFees();
  }

  @Post('global')
  @ApiOperation({ summary: 'Update global fee settings' })
  async updateGlobalFees(@Body() updateDto: UpdateGlobalFeeDto) {
    return this.adminFeeService.updateGlobalFees(updateDto);
  }

  @Get('overrides')
  @ApiOperation({ summary: 'Get all fee overrides' })
  async getFeeOverrides() {
    return this.adminFeeService.getFeeOverrides();
  }
}
