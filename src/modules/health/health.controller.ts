// health.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get server health status' })
  @ApiResponse({ status: 200, description: 'Server health' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getHealth() {
    return this.healthService.getAllHealth();
  }

  @Get('/ping')
  @ApiOperation({ summary: 'Ping' })
  @ApiResponse({ status: 200, description: 'Pong' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async ping() {
    return this.healthService.ping();
  }

  @Get('/exchange/:name')
  @ApiOperation({ summary: 'Get health by exchange name' })
  @ApiParam({ name: 'name', description: 'Exchange name', required: true })
  @ApiResponse({ status: 200, description: 'Health by exchange' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getHealthByExchange(@Param('name') name: string) {
    return this.healthService.getExchangeHealth(name);
  }
}
