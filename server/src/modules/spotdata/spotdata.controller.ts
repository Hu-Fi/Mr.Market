import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { SpotdataService } from 'src/modules/spotdata/spotdata.service';

@ApiTags('spot')
@Controller('spot')
export class SpotdataController {
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
  getSpotData() {
    return this.spotdataService.getSpotData();
  }
}
