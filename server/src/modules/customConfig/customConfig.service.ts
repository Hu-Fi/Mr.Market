/**
 * CustomConfigService
 *
 * This service manages the reading and modification of custom configuration settings.
 * It acts as a layer between the application and the CustomConfigRepository, providing
 * methods to interact with configuration data related to spot fees, maximum balances,
 * and funding account statuses.
 *
 * Dependencies:
 * - CustomConfigRepository: Repository that handles data operations for custom configurations.
 *
 * Methods:
 * - constructor: Initializes the service with the injected CustomConfigRepository.
 * - readSpotFee(): Fetches the current spot fee configuration.
 * - modifySpotFee(newSpotFee: string): Updates the spot fee configuration with a new value.
 * - modifyMaxBalanceInMixinBot(newMaxBalance: string): Updates the maximum balance in the Mixin bot configuration.
 * - modifyMaxBalanceInAPIKey(newMaxBalance: string): Updates the maximum balance in the API key configuration.
 * - readFundingAccountStatus(): Fetches the current status of the funding account.
 *
 * Notes:
 * - Each method interacts directly with the CustomConfigRepository to perform the necessary
 *   read or write operations on the configuration data.
 * - The service abstracts the direct repository interactions, providing a clear API for managing
 *   custom configurations.
 */

import { Injectable } from '@nestjs/common';
import { CustomConfigRepository } from 'src/modules/customConfig/customConfig.repository';

@Injectable()
export class CustomConfigService {
  constructor(private configRepository: CustomConfigRepository) {}
  async readSpotFee() {
    return await this.configRepository.readSpotFee();
  }
  async modifySpotFee(newSpotFee: string) {
    return await this.configRepository.modifySpotFee(newSpotFee);
  }
  async modifyMaxBalanceInMixinBot(newMaxBalance: string) {
    return await this.configRepository.modifyMaxBalanceInMixinBot(
      newMaxBalance,
    );
  }
  async modifyMaxBalanceInAPIKey(newMaxBalance: string) {
    return await this.configRepository.modifyMaxBalanceInAPIKey(newMaxBalance);
  }
  async readFundingAccountStatus() {
    return await this.configRepository.readFundingAccountStatus();
  }
}
