import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  UseGuards,
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
    return this.adminSpotService.addTradingPair(pairDto);
  }

  @Delete('trading-pair/remove/:id')
  @ApiOperation({ summary: 'Remove a spot trading pair' })
  async removeTradingPair(@Param('id') id: string) {
    return this.adminSpotService.removeTradingPair(id);
  }

  @Delete('trading-pair/remove-all')
  @ApiOperation({ summary: 'Remove all spot trading pairs' })
  async removeAllTradingPairs() {
    return this.adminSpotService.removeAllTradingPairs();
  }

  @Post('trading-pair/update/:id')
  @ApiOperation({ summary: 'Update a spot trading pair' })
  @ApiBody({ type: SpotdataTradingPairDto })
  async updateTradingPair(
    @Param('id') id: string,
    @Body() modifications: Partial<SpotdataTradingPairDto>,
  ) {
    return this.adminSpotService.updateTradingPair(id, modifications);
  }
}
