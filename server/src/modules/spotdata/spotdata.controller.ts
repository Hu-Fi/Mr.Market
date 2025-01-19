import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { SpotdataService } from 'src/modules/spotdata/spotdata.service';
import { CustomLogger } from '../logger/logger.service';

@ApiTags('spot')
@Controller('spot')
export class SpotdataController {
  private readonly logger = new CustomLogger(SpotdataController.name);

  constructor(private readonly spotdataService: SpotdataService) {}

  // This endpoint return all the information used for spot trading
  @Get('/info')
  @ApiOperation({
    summary: 'Get spot data',
    description: 'Retrieve spot data information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved spot data successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async getSpotData() {
    try {
      const spotData = await this.spotdataService.getSpotData();
      return {
        code: HttpStatus.OK,
        data: spotData,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve spot data', error.message);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving users: ${error.message}`,
      };
    }
  }
}
