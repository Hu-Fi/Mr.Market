import { Injectable } from '@nestjs/common';
import { AdminSettingsRepository } from './adminSettings.repository';
import { CustomConfigEntity } from 'src/common/entities/custom-config.entity';

@Injectable()
export class AdminSettingsService {
  constructor(private settingsRepository: AdminSettingsRepository) {}
  async getSpotFee() {
    return await this.settingsRepository.getSpotFee();
  }
  async updateSpotFee(newSpotFee: string) {
    return await this.settingsRepository.updateSpotFee(newSpotFee);
  }

  async getAllSettings() {
    return await this.settingsRepository.getConfig();
  }

  async updateSettings(settings: Partial<CustomConfigEntity>) {
    return await this.settingsRepository.updateSettings(settings);
  }
}
