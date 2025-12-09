import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

@ApiTags('Trading Engine')
@Controller('metrics')
export class MetricsController {
  private readonly logger = new CustomLogger(MetricsController.name);

  constructor(private readonly metricsService: MetricsService) { }

  @Get()
  @ApiOperation({ summary: 'Get metrics' })
  @ApiResponse({ status: 200, description: 'Metrics' })
  getMetrics() {
    return this.metricsService.getStrategyMetrics();
  }
}
