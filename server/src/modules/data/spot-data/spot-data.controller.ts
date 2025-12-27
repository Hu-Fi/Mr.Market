import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { SpotdataService } from 'src/modules/data/spot-data/spot-data.service';

@ApiTags('Data')
@Controller('spot')
export class SpotdataController {
  constructor(private readonly spotdataService: SpotdataService) {}

  @Get('/info')
  getSpotData() {
    return this.spotdataService.getSpotData();
  }
}
