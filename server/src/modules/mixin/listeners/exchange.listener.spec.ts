import { Test } from '@nestjs/testing';
import { ExchangeListener } from './exchange.listener';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { getRFC3339Timestamp } from 'src/common/helpers/utils';

describe('ExchangeListener', () => {
  let exchangeListener: ExchangeListener;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExchangeListener,
        {
          provide: ExchangeService,
          useValue: {
            pickAPIKeyOnDemand: jest
              .fn()
              .mockResolvedValue({ type: 'success' }),
            updateSpotOrderState: jest.fn(),
            estimateSpotAmount: jest.fn().mockResolvedValue(0.5),
            placeOrder: jest.fn().mockResolvedValue({ success: true }),
            addMixinReleaseToken: jest
              .fn()
              .mockResolvedValue({ success: true }),
          },
        },
        {
          provide: SnapshotsService,
          useValue: {
            checkMixinBalanceEnough: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    exchangeListener = moduleRef.get<ExchangeListener>(ExchangeListener);
  });

  // Corrected "should successfully place an order" test case
  it('should successfully place an order', async () => {
    // Ensure the payload matches the expected types, including all required fields
    const payload = {
      event: {
        exchangeName: '01',
        symbol: 'BTC/USDT',
        type: 'BUYB',
        userId: 'userid',
        amount: '1',
        orderId: '125',
        baseAssetId: 'base-asset',
        targetAssetId: 'target-asset',
        limitPrice: '50000',
        snapshotId: 'snapshot-id', // Added missing fields to match expected type
        state: 'created',
        createdAt: getRFC3339Timestamp(),
        updatedAt: getRFC3339Timestamp(),
      },
      mixinEvent: {
        orderId: '125',
        userId: 'user-3',
        assetId: 'asset-3',
        amount: '0.5',
        createdAt: getRFC3339Timestamp(),
        updatedAt: getRFC3339Timestamp(),
      },
    };

    await exchangeListener.handlePlaceSpotOrderEvent(payload);
  });
});
