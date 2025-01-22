import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomConfigEntity } from 'src/common/entities/custom-config.entity';

@Injectable()
export class AdminSettingsRepository {
  constructor(
    @InjectRepository(CustomConfigEntity)
    private readonly customRepository: Repository<CustomConfigEntity>,
  ) {}

  async getConfig() {
    return await this.customRepository.findOne({ where: { id: 1 } });
  }

  async getSpotFee() {
    const config = await this.getConfig();
    return config.spot_fee;
  }

  async updateSpotFee(newSpotFee: string) {
    const config = await this.getConfig();
    config.spot_fee = newSpotFee;
    await this.customRepository.save(config);
  }

  async updateSettings(settings: Partial<CustomConfigEntity>) {
    return await this.customRepository.update(1, settings);
  }
}
