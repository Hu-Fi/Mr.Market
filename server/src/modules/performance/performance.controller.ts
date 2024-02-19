import { Controller, Get, Param, Query } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('/:userId')
  getPerformanceByUser(
    @Param('userId') userId: string,
    @Query('strategyType') strategyType?: string
  ) {
    return this.performanceService.getPerformanceByUserAndStrategy(userId, strategyType);
  }
}
