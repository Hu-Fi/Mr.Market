import { Injectable } from '@nestjs/common';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

@Injectable()
export class RebalanceRepository {
  private readonly logger = new CustomLogger(RebalanceRepository.name);

  constructor() { }
}
