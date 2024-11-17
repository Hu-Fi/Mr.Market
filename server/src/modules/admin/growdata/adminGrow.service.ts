import { Injectable } from '@nestjs/common';
import { GrowdataService } from 'src/modules/growdata/growdata.service';

@Injectable()
export class AdminGrowService {
  constructor(private readonly growDataService: GrowdataService) {}
}
