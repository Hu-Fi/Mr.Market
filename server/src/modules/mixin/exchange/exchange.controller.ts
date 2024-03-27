import { Controller, Get, UseGuards } from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'; // Adjust the path as needed

@Controller('exchanges')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('/spot-orders')
  @UseGuards(JwtAuthGuard) // Only if you want this endpoint to be protected
  async getAllSpotOrders() {
    return await this.exchangeService.getAllSpotOrders();
  }
}
