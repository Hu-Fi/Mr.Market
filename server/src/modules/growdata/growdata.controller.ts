import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { GrowdataService } from 'src/modules/growdata/growdata.service';
import { CustomLogger } from '../logger/logger.service';

@ApiTags('grow')
@Controller('grow')
export class GrowdataController {
  private readonly logger = new CustomLogger(GrowdataController.name);

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
  async getGrowData() {
    try {
      const growData = await this.growdataService.getGrowData();
      return {
        code: HttpStatus.OK,
        data: growData,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve grow data', error.message);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving grow data: ${error.message}`,
      };
    }
  }
}
