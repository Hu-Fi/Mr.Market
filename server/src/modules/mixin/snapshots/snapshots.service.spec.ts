import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotsService } from './snapshots.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SnapshotsRepository } from './snapshots.repository';

jest.mock('@nestjs/config');
jest.mock('@nestjs/event-emitter');
jest.mock('@mixin.dev/mixin-node-sdk', () => ({
  MixinApi: jest.fn().mockImplementation(() => ({
    safe: {
      fetchSafeSnapshots: jest.fn().mockResolvedValue([
        {
          type: 'snapshot',
          snapshot_id: '9466c6f3-5dde-301c-ac2e-089718226389',
          user_id: '51186d7e-d488-417d-a031-b4e34f4fdf86',
          opponent_id: '44d9717d-8cae-4004-98a1-f9ad544dcfb1',
          transaction_hash:
            '48d3b00ae9d97931d9b7349c68d428b6efe00a971086c0c6c8481cff1c15147f',
          asset_id: '965e5c6e-434c-3fa9-b780-c50f43cd955c',
          kernel_asset_id:
            'b9f49cf777dc4d03bc54cd1367eebca319f8603ea1ce18910d09e2c540c630d8',
          amount: '1',
          memo: '',
          request_id: '9ce4a641-2e69-4c64-84fb-7b0c8206c03d',
          created_at: '2024-03-05T08:20:09.748501Z',
        },
      ]),
    },
  })),
}));

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn((key) => {
      switch (key) {
        case 'mixin.app_id':
          return 'test_app_id';
        case 'mixin.session_id':
          return 'test_session_id';
        case 'mixin.server_public_key':
          return 'test_server_public_key';
        case 'mixin.session_private_key':
          return 'test_session_private_key';
        default:
          return null;
      }
    }),
  })),
}));

const mockSnapshotsRepository = {
  findSnapshotByID: jest.fn().mockResolvedValue([]),
  createSnapshot: jest.fn().mockResolvedValue([]),
  checkSnapshotExist: jest.fn().mockResolvedValue([]),
};

describe('SnapshotsService', () => {
  let config: ConfigService;
  let service: SnapshotsService;

  beforeEach(async () => {
    mockSnapshotsRepository.findSnapshotByID = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnapshotsService,
        ConfigService,
        EventEmitter2,
        {
          provide: SnapshotsRepository,
          useValue: mockSnapshotsRepository,
        },
      ],
    }).compile();

    service = module.get<SnapshotsService>(SnapshotsService);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(config).toBeDefined();
  });

  it('config should be defined', () => {
    expect(config.get<string>('mixin.app_id')).toBeDefined();
    expect(config.get<string>('mixin.session_id')).toBeDefined();
    expect(config.get<string>('mixin.server_public_key')).toBeDefined();
    expect(config.get<string>('mixin.session_private_key')).toBeDefined();
  });

  describe('fetchAndProcessSnapshots', () => {
    it('should fetch snapshots and process them', async () => {
      await service.fetchAndProcessSnapshots();
    });
  });
});
