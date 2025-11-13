import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { GrowdataService } from 'src/modules/growdata/growdata.service';

@ApiTags('Grow')
@Controller('grow')
export class GrowdataController {
  constructor(private readonly growdataService: GrowdataService) {}

  @Get('/info')
  getGrowData() {
    return this.growdataService.getGrowData();
  }
}
