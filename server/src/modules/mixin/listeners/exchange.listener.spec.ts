import { Test } from '@nestjs/testing';
import { ExchangeListener } from './exchange.listener';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';
import { getRFC3339Timestamp } from 'src/common/helpers/utils';

describe('ExchangeListener', () => {
  let exchangeListener: ExchangeListener;
  let exchangeService: ExchangeService;
  let snapshotsService: SnapshotsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExchangeListener,
        {
          provide: ExchangeService,
          useValue: {
            pickAPIKeyOnDemand: jest.fn(),
            updateSpotOrderState: jest.fn(),
            estimateSpotAmount: jest.fn(),
            placeOrder: jest.fn(),
            addMixinReleaseToken: jest.fn(),
          },
        },
        {
          provide: SnapshotsService,
          useValue: {
            checkMixinBalanceEnough: jest.fn(),
          },
        },
      ],
    }).compile();

    exchangeListener = moduleRef.get<ExchangeListener>(ExchangeListener);
    exchangeService = moduleRef.get<ExchangeService>(ExchangeService);
    snapshotsService = moduleRef.get<SnapshotsService>(SnapshotsService);
  });

  it('should handle API key error', async () => {
    jest.spyOn(exchangeService, 'pickAPIKeyOnDemand').mockResolvedValueOnce({ type: 'error', error: 'message' });
    const mockEvent = {
      event: { exchangeIndex: '01', symbol: 'BTC/USDT', type: 'LB', orderId: '246c42e2-df57-4219-ab70-c84591063c9e', amount: '100', state: 'created', baseAssetId: '7da34502-3505-4944-b29c-0ab9f5b2dfa1', targetAssetId: '7037832e-6479-43d2-ab87-b4dd9b153226', snapshotId: 'eaef5c6f-47cc-449a-8314-4aa676438659',  createdAt: getRFC3339Timestamp(), updatedAt: getRFC3339Timestamp() },
      mixinEvent: { orderId: '30e342ab-a250-4d8a-bea1-09f6de1acc5e', userId: 'userId', assetId: '246c42e2-df57-4219-ab70-c84591063c9e', amount: '100', createdAt: getRFC3339Timestamp(), updatedAt: getRFC3339Timestamp() },
    };

    await exchangeListener.handlePlaceSpotOrderEvent(mockEvent);

    expect(exchangeService.updateSpotOrderState).toHaveBeenCalledWith(mockEvent.event.orderId, STATE_TEXT_MAP['EXCHANGE_BALANCE_NOT_ENOUGH']);
  });

  it('should handle insufficient Mixin balance', async () => {
    jest.spyOn(exchangeService, 'pickAPIKeyOnDemand').mockResolvedValueOnce({ type: 'success' });
    jest.spyOn(snapshotsService, 'checkMixinBalanceEnough').mockResolvedValueOnce(false);
    const mockEvent = {
      event: { exchangeIndex: '01', symbol: 'BTC/USDT', type: 'LB', orderId: '246c42e2-df57-4219-ab70-c84591063c9e', amount: '100', state: 'created', baseAssetId: '7da34502-3505-4944-b29c-0ab9f5b2dfa1', targetAssetId: '7037832e-6479-43d2-ab87-b4dd9b153226', snapshotId: 'eaef5c6f-47cc-449a-8314-4aa676438659',  createdAt: getRFC3339Timestamp(), updatedAt: getRFC3339Timestamp() },
      mixinEvent: { orderId: '30e342ab-a250-4d8a-bea1-09f6de1acc5e', userId: 'userId', assetId: '246c42e2-df57-4219-ab70-c84591063c9e', amount: '100', createdAt: getRFC3339Timestamp(), updatedAt: getRFC3339Timestamp() },
    };

    await exchangeListener.handlePlaceSpotOrderEvent(mockEvent);

    expect(exchangeService.updateSpotOrderState).toHaveBeenCalledWith(mockEvent.event.orderId, STATE_TEXT_MAP['MIXIN_BALANCE_NOT_ENOUGH']);
  });

  // More tests could be added here to cover other paths, such as successfully placing an order
});
