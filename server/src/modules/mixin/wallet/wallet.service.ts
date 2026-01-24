import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { getTotalBalanceFromOutputs } from '@mixin.dev/mixin-node-sdk';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { MixinClientService } from '../client/mixin-client.service';

@Injectable()
export class WalletService {
  private readonly logger = new CustomLogger(WalletService.name);

  constructor(private mixinClientService: MixinClientService) { }

  /**
   * Get deposit address for a specific asset
   */
  async depositAddress(asset_id: string) {
    try {
      const chain_id = (
        await this.mixinClientService.client.network.fetchAsset(asset_id)
      ).chain_id;
      const entities =
        await this.mixinClientService.client.safe.depositEntries({
          members: [this.mixinClientService.keystore.app_id],
          threshold: 1,
          chain_id,
        });
      return {
        address: entities[0].destination,
        memo: entities[0].tag,
      };
    } catch (error) {
      this.logger.error(`Failed to get deposit address: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all asset balances
   */
  async getAllAssetBalances() {
    try {
      // Fetch all outputs
      const outputs = await this.mixinClientService.client.utxo.safeOutputs({});

      // Group outputs by asset ID
      const groupedByAssetId = outputs.reduce((acc, output) => {
        const assetId = output.asset_id;
        if (!acc[assetId]) {
          acc[assetId] = [];
        }
        acc[assetId].push(output);
        return acc;
      }, {});

      // Calculate total balance for each asset
      const assetBalances = Object.entries(groupedByAssetId).reduce(
        (acc, [assetId, outputs]) => {
          // @ts-expect-error types
          const totalBalance = getTotalBalanceFromOutputs(outputs);
          acc[assetId] = totalBalance.toString();
          return acc;
        },
        {},
      );

      // map of AssetID: Balance
      return assetBalances;
    } catch (error) {
      this.logger.error(`Error fetching asset balances: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get balance for a specific asset
   */
  async getAssetBalance(asset_id: string): Promise<string> {
    try {
      return await this.mixinClientService.client.utxo.safeAssetBalance({
        asset: asset_id,
      });
    } catch (e) {
      this.logger.error(`Mixin getAssetBalance() => ${e.message}`);
      return '0';
    }
  }

  /**
   * Check if Mixin balance is enough for a specific amount
   */
  async checkMixinBalanceEnough(
    asset_id: string,
    amount: string,
  ): Promise<boolean> {
    try {
      const balance = await this.getAssetBalance(asset_id);
      if (BigNumber(balance).isLessThan(amount)) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
