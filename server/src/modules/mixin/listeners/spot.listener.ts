import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  isExchangeIndexValid,
  isSpotOrderTypeValid,
  isTradingTypeValid,
} from 'src/common/helpers/checks/spotChecks';
import { SpotOrderCreateEvent } from '../events/spot.event';
import { SnapshotsService } from '../snapshots/snapshots.service';
import BigNumber from 'bignumber.js';
import {
  getAssetIDBySymbol,
  getPairSymbolByKey,
} from 'src/common/helpers/utils';
import { PairsMapKey } from 'src/common/types/pairs/pairs';

@Injectable()
export class SpotOrderListener {
  constructor(private snapshotService: SnapshotsService) {}

  @OnEvent('spot.create')
  async handleSpotOrderCreateEvent(event: SpotOrderCreateEvent) {
    // Check event parameters
    if (!isTradingTypeValid(event.tradingType)) {
      return;
    }
    if (!isSpotOrderTypeValid(event.spotOrderType)) {
      return;
    }
    if (!isExchangeIndexValid(event.exchange)) {
      return;
    }

    // Get Asset ID of buy and sell asset
    const symbol = getPairSymbolByKey(event.destId as PairsMapKey);
    if (symbol === '') {
      // unsupported symbol
      return;
    }
    const { baseAssetID, targetAssetID } = getAssetIDBySymbol(symbol);

    // Determine direction by spot order type
    let buy: boolean;
    if (event.spotOrderType === 'MB' || event.spotOrderType === 'LB') {
      buy = true;
    } else if (event.spotOrderType === 'MS' || event.spotOrderType === 'LS') {
      buy = false;
    } else {
      return;
    }

    // Check payment asset correctness
    if (buy && targetAssetID != event.snapshot.asset_id) {
      // Buy BTC/USDT, pay USDT
      return;
    }

    if (!buy && baseAssetID != event.snapshot.asset_id) {
      // Sell BTC/USDT, pay BTC
      return;
    }

    // Check balance
    // Use a exchange service to actively pick api key (by balance map) to check
    if (buy) {
      // Buy BTC/USDT
      // Check USDT balance in exchange
      // Check BTC balance in mixin
    } else {
      // Sell BTC/USDT
      // Check BTC balance in exchange
      // Check USDT balance in mixin

      const balance = BigNumber(
        await this.snapshotService.getAssetBalance('asset_id_tbd'),
      );
      const amountBN = BigNumber(event.snapshot.amount);
      if (balance.isLessThan(amountBN)) {
        return;
      }
    }

    // 4. Generate and write order to db

    // 5. Emit event to 'exchange place order' event handler
  }
}
