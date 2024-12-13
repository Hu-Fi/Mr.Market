import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { GrowdataService } from 'src/modules/growdata/growdata.service';

@ApiTags('grow')
@Controller('grow')
export class GrowdataController {
  constructor(private readonly growdataService: GrowdataService) {}

  // This endpoint return all the information under grow page
  @Get('/info')
  @ApiOperation({
    summary: 'Get grow data',
    description: 'Retrieve grow data information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieved grow data successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  getGrowData() {
    return this.growdataService.getGrowData();
  }
}
