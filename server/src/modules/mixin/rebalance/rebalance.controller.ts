// rebalance.controller.ts
import {
  Body,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  HttpException,
  UseGuards,
  Controller,
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

}
