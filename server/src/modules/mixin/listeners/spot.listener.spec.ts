import { Test } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getAssetIDBySymbol, getPairSymbolByKey, getRFC3339Timestamp } from 'src/common/helpers/utils';
import { SpotOrderCreateEvent } from 'src/modules/mixin/events/spot.event';
import { SpotOrderListener } from 'src/modules/mixin/listeners/spot.listener';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { PAIRS_MAP } from 'src/common/constants/pairs';
import { isExchangeIndexValid, isSpotOrderTypeValid, isTradingTypeValid } from 'src/common/helpers/checks/spotChecks';

jest.mock('src/modules/mixin/exchange/exchange.service', () => ({
  ExchangeService: jest.fn().mockImplementation(() => ({
    createSpotOrder: jest.fn(),
  })),
}));

jest.mock('src/common/helpers/utils', () => ({
  ...jest.requireActual('src/common/helpers/utils'),
  getPairSymbolByKey: jest.fn().mockReturnValue('BTC/USDT-ERC20'),
  getAssetIDBySymbol: jest.fn().mockReturnValue({ baseAssetID: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa', targetAssetID: '4d8c508b-91c5-375b-92b0-ee702ed2dac5' }),
}));

describe('SpotOrderListener', () => {
  let listener: SpotOrderListener;
  let exchangeService: ExchangeService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SpotOrderListener,
        ExchangeService,
        EventEmitter2,
      ],
    }).compile();

    listener = moduleRef.get<SpotOrderListener>(SpotOrderListener);
    exchangeService = moduleRef.get<ExchangeService>(ExchangeService);
    eventEmitter = moduleRef.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and emit a spot order for valid events', async () => {
    const mockEvent: SpotOrderCreateEvent = {
      tradingType: 'SP',
      spotOrderType: 'LB',
      exchangeIndex: '01',
      destId: 'Z7GC',
      snapshot: {
        snapshot_id: 'e120cc62-ca40-4319-8138-1279d4dca4e7',
        asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
        opponent_id: '6a586b29-79bb-4f5f-a396-8bcc070c30cf',
        amount: '100',
        type: 'transaction',
        user_id: '8efb83ea-279e-4fce-b27a-31c110bfad8f',
        memo: 'xxx',
        transaction_hash: '0x1232131283129381293891230',
        created_at: getRFC3339Timestamp(),
        trace_id: '8476a132-eb03-4d6d-a4d3-39c87651a1f0',
        confirmations: 64,
        opening_balance: '0',
        closing_balance: '0',
        deposit: null,
        withdrawal: null,
      },
      limitPrice: '50000',
      refId: 'm.23123',
    };
  
    jest.spyOn(exchangeService, 'createSpotOrder').mockResolvedValueOnce(undefined);
    jest.spyOn(eventEmitter, 'emit').mockImplementationOnce(() => {return true});
  
    await listener.handleSpotOrderCreateEvent(mockEvent);

    expect(isTradingTypeValid(mockEvent.tradingType)).toBe(true);
    expect(isSpotOrderTypeValid(mockEvent.spotOrderType)).toBe(true);
    expect(isExchangeIndexValid(mockEvent.exchangeIndex)).toBe(true);
    const symbol = getPairSymbolByKey(mockEvent.destId);
    expect(symbol).toBe(PAIRS_MAP[mockEvent.destId]);
    const { baseAssetID, targetAssetID } = getAssetIDBySymbol(symbol);
    expect(baseAssetID).toBeDefined();
    expect(targetAssetID).toBeDefined();
    const buy = mockEvent.spotOrderType.endsWith('B') ? true : mockEvent.spotOrderType.endsWith('S') ? false : undefined;
    expect(buy).toBeDefined();
    expect(buy && targetAssetID === mockEvent.snapshot.asset_id).toBeTruthy();
    expect(buy && baseAssetID != mockEvent.snapshot.asset_id).toBeTruthy();

    expect(buy && targetAssetID != mockEvent.snapshot.asset_id).toBeFalsy();
    expect(!buy && baseAssetID != mockEvent.snapshot.asset_id).toBeFalsy();
  });
});
