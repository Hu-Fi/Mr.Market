import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { AdminOrdersService } from './adminOrders.service';

@ApiTags('admin/orders')
@Controller('admin/orders')
@UseGuards(JwtAuthGuard)
export class AdminOrdersController {
  private readonly logger = new CustomLogger(AdminOrdersController.name);

  constructor(private adminOrdersService: AdminOrdersService) {}

  @Get('/all')
  @ApiResponse({
    status: 200,
    description: 'Retrieved all orders successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllOrders() {
    try {
      const orders = await this.adminOrdersService.getAllOrders();
      return {
        code: HttpStatus.OK,
        data: orders,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve all orders', error.message);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve all orders',
      };
    }
  }

  @Get('/arbitrage/all')
  @ApiResponse({
    status: 200,
    description: 'Retrieved all arbitrage orders successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllArbitrageOrders() {
    try {
      const orders = await this.adminOrdersService.getAllArbitrageOrders();
      return {
        code: HttpStatus.OK,
        data: orders,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve arbitrage orders', error.message);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve arbitrage orders',
      };
    }
  }

  @Get('/arbitrage/:userId')
  @ApiResponse({
    status: 200,
    description: 'Retrieved arbitrage orders for a specific user successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getArbitrageOrdersByUserId(@Param('userId') userId: string) {
    try {
      const orders = await this.adminOrdersService.getArbitrageOrdersByUserId(
        userId,
      );
      return {
        code: HttpStatus.OK,
        data: orders,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve arbitrage orders', error.message);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve arbitrage orders',
      };
    }
  }

  @Get('/spot/all')
  @ApiResponse({
    status: 200,
    description: 'Retrieved all spot orders successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllSpotOrders() {
    try {
      const orders = await this.adminOrdersService.getAllSpotOrders();
      return {
        code: HttpStatus.OK,
        data: orders,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve spot orders', error.message);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve spot orders',
      };
    }
  }

  @Get('/spot/:userId')
  @ApiResponse({
    status: 200,
    description: 'Retrieved spot orders for a specific user successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getSpotOrdersByUserId(@Param('userId') userId: string) {
    try {
      const orders = await this.adminOrdersService.getSpotOrdersByUserId(
        userId,
      );
      return {
        code: HttpStatus.OK,
        data: orders,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve spot orders', error.message);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve spot orders',
      };
    }
  }

  @Get('/market-making/all')
  @ApiResponse({
    status: 200,
    description: 'Retrieved all market making orders successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllMarketMakingOrders() {
    try {
      const orders = await this.adminOrdersService.getAllMarketMakingOrders();
      return {
        code: HttpStatus.OK,
        data: orders,
      };
    } catch (error) {
      this.logger.error(
        'Failed to retrieve market making orders',
        error.message,
      );
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve market making orders',
      };
    }
  }

  @Get('/market-making/:userId')
  @ApiResponse({
    status: 200,
    description:
      'Retrieved market making orders for a specific user successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getMarketMakingOrdersByUserId(@Param('userId') userId: string) {
    try {
      const orders =
        await this.adminOrdersService.getMarketMakingOrdersByUserId(userId);
      return {
        code: HttpStatus.OK,
        data: orders,
      };
    } catch (error) {
      this.logger.error(
        'Failed to retrieve market making orders',
        error.message,
      );
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve market making orders',
      };
    }
  }

  @Get('/simply-grow/all')
  @ApiResponse({
    status: 200,
    description: 'Retrieved all simply grow orders successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllSimplyGrowOrders() {
    try {
      const orders = await this.adminOrdersService.getAllSimplyGrowOrders();
      return {
        code: HttpStatus.OK,
        data: orders,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve simply grow orders', error.message);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve simply grow orders',
      };
    }
  }

  @Get('/simply-grow/:userId')
  @ApiResponse({
    status: 200,
    description:
      'Retrieved simply grow orders for a specific user successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getSimplyGrowOrdersByUserId(@Param('userId') userId: string) {
    try {
      const orders = await this.adminOrdersService.getSimplyGrowOrdersByUserId(
        userId,
      );
      return {
        code: HttpStatus.OK,
        data: orders,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve simply grow orders', error.message);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve simply grow orders',
      };
    }
  }
}
