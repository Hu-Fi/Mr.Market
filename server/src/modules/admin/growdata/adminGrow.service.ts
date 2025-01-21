import { Injectable } from '@nestjs/common';
import { GrowdataService } from 'src/modules/growdata/growdata.service';
import {
  GrowdataSimplyGrowToken,
  GrowdataArbitragePair,
  GrowdataMarketMakingPair,
} from 'src/common/entities/grow-data.entity';
import { GrowdataRepository } from 'src/modules/growdata/growdata.repository';
import { CustomLogger } from 'src/modules/logger/logger.service';
import {
  GrowdataArbitragePairDto,
  GrowdataMarketMakingPairDto,
} from 'src/modules/admin/growdata/adminGrow.dto';

@Injectable()
export class AdminGrowService {
  private readonly logger = new CustomLogger(AdminGrowService.name);

  constructor(
    private readonly growDataService: GrowdataService,
    private readonly growdataRepository: GrowdataRepository,
  ) {}

  // SimplyGrow token
  async addSimplyGrowToken(token: GrowdataSimplyGrowToken) {
    return this.growdataRepository.addSimplyGrowToken(token);
  }

  async removeSimplyGrowToken(asset_id: string) {
    return this.growdataRepository.removeSimplyGrowToken(asset_id);
  }

  async removeAllSimplyGrowTokens() {
    const tokens = await this.growDataService.getAllSimplyGrowTokens();
    for (const token of tokens) {
      await this.growdataRepository.removeSimplyGrowToken(token.asset_id);
    }
  }

  async updateSimplyGrowToken(
    asset_id: string,
    modifications: Partial<GrowdataSimplyGrowToken>,
  ) {
    try {
      await this.growdataRepository.updateSimplyGrowToken(
        asset_id,
        modifications,
      );
    } catch (error) {
      this.logger.error(
        `Failed to modify simply grow token with ID ${asset_id}`,
        error,
      );
    }
  }

  // Market making
  async addMarketMakingPair(pairDto: GrowdataMarketMakingPairDto) {
    if (!pairDto.exchange_id) {
      throw new Error('Exchange ID is required');
    }
    return this.growdataRepository.addMarketMakingPair(pairDto);
  }

  async removeMarketMakingPair(id: string) {
    return this.growdataRepository.removeMarketMakingPair(id);
  }

  async removeAllMarketMakingPairs() {
    const pairs = await this.growDataService.getAllMarketMakingPairs();
    for (const pair of pairs) {
      await this.growDataService.removeMarketMakingPair(pair.id);
    }
  }

  async updateMarketMakingPair(
    id: string,
    modifications: Partial<GrowdataMarketMakingPair>,
  ) {
    const pair = await this.growDataService.getMarketMakingPairById(id);
    if (pair) {
      Object.assign(pair, modifications);
      // Assuming there's a method to update the pair
      return this.growdataRepository.addMarketMakingPair(pair);
    }
  }

  // Arbitrage
  async addArbitragePair(pairDto: GrowdataArbitragePairDto) {
    if (!pairDto.base_exchange_id || !pairDto.target_exchange_id) {
      throw new Error('Exchange ID is required');
    }
    return this.growdataRepository.addArbitragePair(pairDto);
  }

  async removeArbitragePair(id: string) {
    return this.growdataRepository.removeArbitragePair(id);
  }

  async removeAllArbitragePairs() {
    const pairs = await this.growDataService.getAllArbitragePairs();
    for (const pair of pairs) {
      await this.growdataRepository.removeArbitragePair(pair.id);
    }
  }

  async updateArbitragePair(
    id: string,
    modifications: Partial<GrowdataArbitragePair>,
  ) {
    try {
      await this.growdataRepository.updateArbitragePair(id, modifications);
    } catch (error) {
      this.logger.error(`Failed to modify arbitrage pair with ID ${id}`, error);
    }
  }
}
