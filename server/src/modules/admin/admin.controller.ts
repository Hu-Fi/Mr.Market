import {
  Controller,
  Get,
  Post,
  Body,
  /*Param,*/ UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Ensure authentication
import { StartStrategyDto, StopStrategyDto } from './admin-strategy.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard) // Secures the endpoints with JWT
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('strategy/start')
  async startStrategy(@Body() startStrategyDto: StartStrategyDto) {
    return this.adminService.startStrategy(startStrategyDto);
  }

  @Post('strategy/stop')
  async stopStrategy(@Body() stopStrategyDto: StopStrategyDto) {
    return this.adminService.stopStrategy(stopStrategyDto);
  }

  //TODO: Implement returning strategies to be dispalyed.
  // @Get('strategies')
  // async getRunningStrategies() {
  //   return this.adminService.getRunningStrategies();
  // }

  // @Get('strategy/performance/:strategyKey')
  // async getStrategyPerformance(@Param('strategyKey') strategyKey: string) {
  //   return this.adminService.getStrategyPerformance(strategyKey);
  // }

  @Get('/admin')
  getAdminData() {
    return 'This is admin data';
  }

  @Get('/config')
  getConfigData() {
    return 'This is config data';
  }
}
