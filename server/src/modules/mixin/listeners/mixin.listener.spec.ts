import { Test, TestingModule } from '@nestjs/testing';
import { MixinListener } from './mixin.listener';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { CustomConfigService } from 'src/modules/customConfig/customConfig.service';
import { MixinReleaseTokenEvent } from 'src/modules/mixin/events/spot.event';
import * as uuid from 'uuid';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';
import { getRFC3339Timestamp } from 'src/common/helpers/utils';

jest.mock('src/modules/mixin/snapshots/snapshots.service');
jest.mock('src/modules/mixin/exchange/exchange.service');
jest.mock('src/modules/customConfig/customConfig.service');

describe('MixinListener', () => {
  let listener: MixinListener;
  let snapshotsService: jest.Mocked<SnapshotsService>;
  let exchangeService: jest.Mocked<ExchangeService>;
  let customConfigService: jest.Mocked<CustomConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MixinListener,
        SnapshotsService,
        ExchangeService,
        CustomConfigService,
      ],
    }).compile();

    listener = module.get<MixinListener>(MixinListener);
    snapshotsService = module.get(SnapshotsService);
    exchangeService = module.get(ExchangeService);
    customConfigService = module.get(CustomConfigService);

    jest.clearAllMocks();
  });

  it('should fail when assetId is invalid', async () => {
    const mockEvent: MixinReleaseTokenEvent = {
      assetId: 'invalid-uuid',
      userId: uuid.v4(),
      orderId: uuid.v4(),
      amount: '100',
      createdAt: getRFC3339Timestamp(),
      updatedAt: getRFC3339Timestamp(),
      limitAmount: '',
      limitFilled: '',
      receiveAmount: '',
    };
    await listener.handleReleaseTokenEvent(mockEvent);
    expect(exchangeService.updateSpotOrderState).toHaveBeenCalledWith(
      mockEvent.orderId,
      STATE_TEXT_MAP['MIXIN_RELEASE_FAILED'],
    );
  });

  it('should fail when userId is invalid', async () => {
    const mockEvent: MixinReleaseTokenEvent = {
      assetId: uuid.v4(),
      userId: 'invalid-uuid',
      orderId: uuid.v4(),
      amount: '100',
      createdAt: getRFC3339Timestamp(),
      updatedAt: getRFC3339Timestamp(),
    };
    await listener.handleReleaseTokenEvent(mockEvent);
    expect(exchangeService.updateSpotOrderState).toHaveBeenCalledWith(
      mockEvent.orderId,
      STATE_TEXT_MAP['MIXIN_RELEASE_FAILED'],
    );
  });

  it('should handle duplicate release attempt gracefully', async () => {
    const mockEvent: MixinReleaseTokenEvent = {
      assetId: uuid.v4(),
      userId: uuid.v4(),
      orderId: uuid.v4(),
      amount: '100',
      createdAt: getRFC3339Timestamp(),
      updatedAt: getRFC3339Timestamp(),
      limitAmount: '',
      limitFilled: '',
      receiveAmount: '',
    };
    exchangeService.readMixinReleaseHistory.mockResolvedValueOnce(true); // Simulate order already in release history
    await listener.handleReleaseTokenEvent(mockEvent);
    expect(exchangeService.updateSpotOrderState).not.toHaveBeenCalledWith(
      mockEvent.orderId,
      STATE_TEXT_MAP['MIXIN_RELEASED'],
    );
  });

  it('should successfully release token and record history', async () => {
    const mockEvent: MixinReleaseTokenEvent = {
      assetId: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
      userId: uuid.v4(),
      orderId: uuid.v4(),
      amount: '100',
      createdAt: getRFC3339Timestamp(),
      updatedAt: getRFC3339Timestamp(),
      limitAmount: '',
      limitFilled: '',
      receiveAmount: '',
    };
    exchangeService.readMixinReleaseHistory.mockResolvedValueOnce(false); // Simulate order not in release history
    customConfigService.readSpotFee.mockResolvedValue('0.01');
    snapshotsService.sendMixinTx.mockResolvedValue([
      {
        type: 'kernel_transaction_request',
        request_id: '6fadbffd-46d0-4fe9-b699-cbd81e3ec592',
        transaction_hash:
          'e4fe30aa3f222f7de1518c8446dbd030d11a506faabcfe8592f9743d15bedb16',
        asset: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
        amount: '13422',
        extra: 'In itself beautiful.',
        user_id: 'bd151efc-dce5-44f1-b4bb-1534075d2b93',
        state: 'pending',
        raw_transaction: 'These Mr administration explain.',
        created_at: '1978-09-11T21:29:32',
        updated_at: '1995-11-04T14:05:04',
        snapshot_id: '2ef9999a-0419-4df1-afdc-c58c244203f5',
        snapshot_hash:
          'fc7607d1e5bdc03e4ad64145882e8f80df7628e161d99db16cf4c16f5dcf22b9',
        snapshot_at: '2023-10-18T19:57:03',
        receivers: ['03b541cc-a758-49dd-93c5-378fc4c49bd6'],
        senders: ['5b101bec-d407-4933-b8d1-3e92ed927218'],
        senders_hash:
          'b155d77c4018bc29190117a963300f15f62644a035898fafa056f15eae1c786e',
        senders_threshold: 2,
        signers: ['36b88829-10c6-4d9f-a34d-e46fead6f6eb'],
        views: ['Address amount.'],
      },
    ]);
    await listener.handleReleaseTokenEvent(mockEvent);
    expect(exchangeService.updateSpotOrderState).toHaveBeenCalledWith(
      mockEvent.orderId,
      STATE_TEXT_MAP['MIXIN_RELEASED'],
    );
  });

  it('should fail to release token if sendMixinTx fails', async () => {
    const mockEvent: MixinReleaseTokenEvent = {
      assetId: uuid.v4(),
      userId: uuid.v4(),
      orderId: uuid.v4(),
      amount: '100',
      createdAt: getRFC3339Timestamp(),
      updatedAt: getRFC3339Timestamp(),
      limitAmount: '',
      limitFilled: '',
      receiveAmount: '',
    };
    exchangeService.readMixinReleaseHistory.mockResolvedValueOnce(false); // Simulate order not in release history
    customConfigService.readSpotFee.mockResolvedValue('0.01');
    snapshotsService.sendMixinTx.mockResolvedValue([]); // Simulate failure in sending transaction
    await listener.handleReleaseTokenEvent(mockEvent);
    expect(exchangeService.updateSpotOrderState).toHaveBeenCalledWith(
      mockEvent.orderId,
      STATE_TEXT_MAP['MIXIN_RELEASE_FAILED'],
    );
  });
});
