// TODO: add return code and data
import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SpotdataTradingPairDto } from 'src/modules/admin/spotData/adminSpot.dto';
import { AdminSpotService } from 'src/modules/admin/spotData/adminSpot.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiTags('admin/spot')
@Controller('admin/spot')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminSpotController {
  constructor(private readonly adminSpotService: AdminSpotService) {}

  // Spot trading pair endpoints
  @Post('trading-pair/add')
  @ApiOperation({ summary: 'Add a new spot trading pair' })
  @ApiBody({ type: SpotdataTradingPairDto })
  async addTradingPair(@Body() pairDto: SpotdataTradingPairDto) {
    try {
      const result = await this.adminSpotService.addTradingPair(pairDto);
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Delete('trading-pair/remove/:id')
  @ApiOperation({ summary: 'Remove a spot trading pair' })
  async removeTradingPair(@Param('id') id: string) {
    try {
      const result = await this.adminSpotService.removeTradingPair(id);
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Delete('trading-pair/remove-all')
  @ApiOperation({ summary: 'Remove all spot trading pairs' })
  async removeAllTradingPairs() {
    try {
      const result = await this.adminSpotService.removeAllTradingPairs();
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }

  @Post('trading-pair/update/:id')
  @ApiOperation({ summary: 'Update a spot trading pair' })
  @ApiBody({ type: SpotdataTradingPairDto })
  async updateTradingPair(
    @Param('id') id: string,
    @Body() modifications: Partial<SpotdataTradingPairDto>,
  ) {
    try {
      const result = await this.adminSpotService.updateTradingPair(
        id,
        modifications,
      );
      return {
        code: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
