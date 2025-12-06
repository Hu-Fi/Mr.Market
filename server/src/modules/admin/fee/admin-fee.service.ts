import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomConfigEntity } from 'src/common/entities/custom-config.entity';
import { SpotdataTradingPair } from 'src/common/entities/spot-data.entity';
import { GrowdataMarketMakingPair } from 'src/common/entities/grow-data.entity';
import { UpdateGlobalFeeDto } from './admin-fee.dto';

@Injectable()
export class AdminFeeService {
  constructor(
    @InjectRepository(CustomConfigEntity)
    private readonly customConfigRepository: Repository<CustomConfigEntity>,
    @InjectRepository(SpotdataTradingPair)
    private readonly spotPairRepository: Repository<SpotdataTradingPair>,
    @InjectRepository(GrowdataMarketMakingPair)
    private readonly mmPairRepository: Repository<GrowdataMarketMakingPair>,
  ) { }

  async getGlobalFees() {
    const config = await this.customConfigRepository.findOne({
      where: { config_id: 1 }, // Assuming config_id 1 is the default
    });

    // If no config exists, return defaults (though one should usually exist)
    if (!config) {
      return {
        spot_fee: '0',
        market_making_fee: '0',
        enable_spot_fee: true,
        enable_market_making_fee: true
      }
    }

    return {
      spot_fee: config.spot_fee,
      market_making_fee: config.market_making_fee,
      enable_spot_fee: config.enable_spot_fee,
      enable_market_making_fee: config.enable_market_making_fee,
    };
  }

  async updateGlobalFees(updateDto: UpdateGlobalFeeDto) {
    let config = await this.customConfigRepository.findOne({
      where: { config_id: 1 },
    });

    if (!config) {
      config = this.customConfigRepository.create({ config_id: 1, ...updateDto });
    } else {
      Object.assign(config, updateDto);
    }

    return this.customConfigRepository.save(config);
  }

  async getFeeOverrides() {
    const spotPairs = await this.spotPairRepository.find();
    const mmPairs = await this.mmPairRepository.find();

    const spotOverrides = spotPairs
      .filter((p) => p.custom_fee_rate !== null && p.custom_fee_rate !== undefined)
      .map((p) => ({
        type: 'spot',
        id: p.id,
        symbol: p.symbol,
        custom_fee_rate: p.custom_fee_rate,
      }));

    const mmOverrides = mmPairs
      .filter((p) => p.custom_fee_rate !== null && p.custom_fee_rate !== undefined)
      .map((p) => ({
        type: 'market_making',
        id: p.id,
        symbol: p.symbol,
        exchange_id: p.exchange_id,
        custom_fee_rate: p.custom_fee_rate,
      }));

    return [...spotOverrides, ...mmOverrides];
  }
}
