import { Test } from '@nestjs/testing';
import { validate as uuidValidate } from 'uuid';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { STATE_TEXT_MAP } from 'src/common/types/orders/states';
import { MixinListener } from 'src/modules/mixin/listeners/mixin.listener';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { MixinReleaseTokenEvent } from 'src/modules/mixin/events/spot.event';
import { getRFC3339Timestamp } from 'src/common/helpers/utils';

jest.mock('src/modules/mixin/exchange/exchange.service');
jest.mock('src/modules/mixin/snapshots/snapshots.service');
jest.mock('uuid', () => ({
  ...jest.requireActual('uuid'),
  validate: jest.fn(),
}));

describe('MixinListener', () => {
  let mixinListener: MixinListener;
  let exchangeService: ExchangeService;
  let snapshotsService: SnapshotsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MixinListener,
        ExchangeService,
        SnapshotsService,
      ],
    }).compile();

    mixinListener = moduleRef.get<MixinListener>(MixinListener);
    exchangeService = moduleRef.get<ExchangeService>(ExchangeService);
    snapshotsService = moduleRef.get<SnapshotsService>(SnapshotsService);

    jest.clearAllMocks();
  });

  it('should fail release if assetId is invalid', async () => {
    const mockEvent: MixinReleaseTokenEvent = {
      orderId: 'valid-uuid-order',
      userId: 'valid-uuid-user',
      assetId: 'invalid-uuid',
      amount: '100',
      createdAt: getRFC3339Timestamp(),
      updatedAt:  getRFC3339Timestamp(),
    };
    (uuidValidate as jest.Mock).mockImplementation((id) => id === 'valid-uuid-order' || id === 'valid-uuid-user');

    await mixinListener.handleReleaseTokenEvent(mockEvent);

    expect(exchangeService.updateSpotOrderState).toHaveBeenCalledWith(
      mockEvent.orderId,
      STATE_TEXT_MAP['MIXIN_RELEASE_FAILED'],
    );
  });
});
