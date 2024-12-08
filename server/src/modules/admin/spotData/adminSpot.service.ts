import { Injectable } from '@nestjs/common';
import { SpotdataTradingPair } from 'src/common/entities/spot-data.entity';
import { SpotdataRepository } from 'src/modules/spotdata/spotdata.repository';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { SpotdataTradingPairDto } from 'src/modules/admin/spotData/adminSpot.dto';

@Injectable()
export class AdminSpotService {
  private readonly logger = new CustomLogger(AdminSpotService.name);

  constructor(private readonly spotdataRepository: SpotdataRepository) {}

  // Trading Pair
  async addTradingPair(pairDto: SpotdataTradingPairDto) {
    const pair: SpotdataTradingPair = {
      ...pairDto,
    };
    return this.spotdataRepository.addTradingPair(pair);
  }

  async removeTradingPair(id: string) {
    return this.spotdataRepository.removeTradingPair(id);
  }

  async removeAllTradingPairs() {
    const pairs = await this.spotdataRepository.findAllTradingPairs();
    for (const pair of pairs) {
      await this.spotdataRepository.removeTradingPair(pair.id);
    }
  }

  async updateTradingPair(
    id: string,
    modifications: Partial<SpotdataTradingPair>,
  ) {
    try {
      await this.spotdataRepository.updateTradingPair(id, modifications);
    } catch (error) {
      this.logger.error(`Failed to modify trading pair with ID ${id}`, error);
    }
  }
}
