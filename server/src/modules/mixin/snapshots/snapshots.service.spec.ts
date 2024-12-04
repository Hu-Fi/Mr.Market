// snapshots.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotsService } from './snapshots.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SnapshotsRepository } from 'src/modules/mixin/snapshots/snapshots.repository';
import { CustomLogger } from 'src/modules/logger/logger.service';
import {
  MixinApi,
  SequencerTransactionRequest,
} from '@mixin.dev/mixin-node-sdk';

jest.mock('@mixin.dev/mixin-node-sdk', () => {
  return {
    MixinApi: jest.fn(),
  };
});

jest.mock('src/common/helpers/mixin/memo', () => ({
  decodeSpotMemo: jest.fn(),
  decodeArbitrageMemo: jest.fn(),
  decodeMarketMakingMemo: jest.fn(),
}));

describe('SnapshotsService', () => {
  let service: SnapshotsService;
  let mockMixinApi: any;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockEventEmitter2 = {
    emit: jest.fn(),
  };

  const mockSnapshotsRepository = {
    createSnapshot: jest.fn(),
    checkSnapshotExist: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'mixin.app_id':
          return 'test_app_id';
        case 'mixin.session_id':
          return 'test_session_id';
        case 'mixin.server_public_key':
          return 'test_server_public_key';
        case 'mixin.session_private_key':
          return 'test_session_private_key';
        case 'mixin.spend_private_key':
          return 'test_spend_private_key';
        case 'strategy.run':
          return 'true';
        default:
          return null;
      }
    });

    mockMixinApi = {
      safe: {
        fetchSafeSnapshots: jest.fn(),
        depositEntries: jest.fn(),
      },
      network: {
        fetchAsset: jest.fn(),
        searchAssets: jest.fn(),
      },
      utxo: {
        safeOutputs: jest.fn(),
        ghostKey: jest.fn(),
        verifyTransaction: jest.fn(),
        sendTransactions: jest.fn(),
        fetchTransaction: jest.fn(),
        safeAssetBalance: jest.fn(),
      },
    };

    (MixinApi as jest.Mock).mockReturnValue(mockMixinApi);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnapshotsService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: EventEmitter2, useValue: mockEventEmitter2 },
        { provide: SnapshotsRepository, useValue: mockSnapshotsRepository },
        { provide: CustomLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<SnapshotsService>(SnapshotsService);

    // Mock the logger methods
    jest.spyOn(service['logger'], 'log').mockImplementation(mockLogger.log);
    jest.spyOn(service['logger'], 'error').mockImplementation(mockLogger.error);
    jest.spyOn(service['logger'], 'warn').mockImplementation(mockLogger.warn);
    jest.spyOn(service['logger'], 'debug').mockImplementation(mockLogger.debug);
  });

  describe('createSnapshot', () => {
    it('should create a snapshot', async () => {
      const snapshot = { snapshot_id: 'test_snapshot_id' } as any;
      mockSnapshotsRepository.createSnapshot.mockResolvedValue(snapshot);

      const result = await service.createSnapshot(snapshot);

      expect(mockSnapshotsRepository.createSnapshot).toHaveBeenCalledWith(
        snapshot,
      );
      expect(result).toEqual(snapshot);
    });

    it('should handle error when creating a snapshot', async () => {
      const snapshot = { snapshot_id: 'test_snapshot_id' } as any;
      const error = new Error('Test error');
      mockSnapshotsRepository.createSnapshot.mockRejectedValue(error);

      const result = await service.createSnapshot(snapshot);

      expect(mockSnapshotsRepository.createSnapshot).toHaveBeenCalledWith(
        snapshot,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        `createSnapshot()=> ${error}`,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('fetchAndProcessSnapshots', () => {
    it('should fetch and process snapshots', async () => {
      const snapshots = [
        { snapshot_id: 'test_snapshot_id_1' },
        { snapshot_id: 'test_snapshot_id_2' },
      ];
      mockMixinApi.safe.fetchSafeSnapshots.mockResolvedValue(snapshots);

      jest
        .spyOn<any, any>(service, 'handleSnapshot')
        .mockResolvedValue(undefined);

      const result = await service.fetchAndProcessSnapshots();

      expect(mockMixinApi.safe.fetchSafeSnapshots).toHaveBeenCalledWith({});
      expect(service['handleSnapshot']).toHaveBeenCalledTimes(snapshots.length);
      expect(service['handleSnapshot']).toHaveBeenCalledWith(snapshots[0]);
      expect(service['handleSnapshot']).toHaveBeenCalledWith(snapshots[1]);
      expect(result).toEqual(snapshots);
    });

    it('should log error if no snapshots are fetched', async () => {
      mockMixinApi.safe.fetchSafeSnapshots.mockResolvedValue(null);

      const result = await service.fetchAndProcessSnapshots();

      expect(mockMixinApi.safe.fetchSafeSnapshots).toHaveBeenCalledWith({});
      expect(mockLogger.error).toHaveBeenCalledWith(
        'fetchAndProcessSnapshots()=> No snapshots',
      );
      expect(result).toBeUndefined();
    });

    it('should handle error during fetching snapshots', async () => {
      const error = new Error('Test error');
      mockMixinApi.safe.fetchSafeSnapshots.mockRejectedValue(error);

      const result = await service.fetchAndProcessSnapshots();

      expect(mockMixinApi.safe.fetchSafeSnapshots).toHaveBeenCalledWith({});
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Failed to fetch snapshots: ${error}`,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('depositAddress', () => {
    it('should return deposit address and memo', async () => {
      const asset_id = 'test_asset_id';
      const chain_id = 'test_chain_id';
      const destination = 'test_destination';
      const tag = 'test_tag';

      mockMixinApi.network.fetchAsset.mockResolvedValue({ chain_id });
      mockMixinApi.safe.depositEntries.mockResolvedValue([
        { destination, tag },
      ]);

      const result = await service.depositAddress(asset_id);

      expect(mockMixinApi.network.fetchAsset).toHaveBeenCalledWith(asset_id);
      expect(mockMixinApi.safe.depositEntries).toHaveBeenCalledWith({
        members: [service['keystore'].app_id],
        threshold: 1,
        chain_id,
      });
      expect(result).toEqual({ address: destination, memo: tag });
    });

    it('should handle error when fetching deposit address', async () => {
      const asset_id = 'test_asset_id';
      const error = new Error('Test error');

      mockMixinApi.network.fetchAsset.mockRejectedValue(error);

      const result = await service.depositAddress(asset_id);

      expect(mockMixinApi.network.fetchAsset).toHaveBeenCalledWith(asset_id);
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Failed to get deposit address: ${error}`,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getAssetIdFromMixin', () => {
    it('should return asset ID for valid token symbol', async () => {
      const tokenSymbol = 'BTC';
      const asset_id = 'test_asset_id';
      const assets = [{ symbol: 'BTC', asset_id }];

      mockMixinApi.network.searchAssets.mockResolvedValue(assets);

      const result = await service.getAssetIdFromMixin(tokenSymbol);

      expect(mockMixinApi.network.searchAssets).toHaveBeenCalledWith(
        tokenSymbol,
      );
      expect(result).toEqual(asset_id);
    });

    it('should throw error for invalid token symbol', async () => {
      const tokenSymbol = 'INVALID';
      const assets = [];

      mockMixinApi.network.searchAssets.mockResolvedValue(assets);

      await expect(
        service.getAssetIdFromMixin(tokenSymbol),
      ).rejects.toThrowError(
        `Unable to fetch asset ID for token symbol: ${tokenSymbol}`,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Failed to fetch asset ID for ${tokenSymbol}: Asset not found for token symbol: ${tokenSymbol}`,
      );
    });

    it('should handle error during asset fetching', async () => {
      const tokenSymbol = 'BTC';
      const error = new Error('Test error');

      mockMixinApi.network.searchAssets.mockRejectedValue(error);

      await expect(
        service.getAssetIdFromMixin(tokenSymbol),
      ).rejects.toThrowError(
        `Unable to fetch asset ID for token symbol: ${tokenSymbol}`,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(
        `Failed to fetch asset ID for ${tokenSymbol}: ${error.message}`,
      );
    });
  });

  describe('initiateUserTransfer', () => {
    it('should initiate user transfer', async () => {
      const userId = 'test_user_id';
      const tokenSymbol = 'BTC';
      const amount = 1;
      const asset_id = 'test_asset_id';

      const transferResult: SequencerTransactionRequest[] = [
        {
          raw_transaction: 'raw-transaction-data',
          request_id: 'request-id',
          type: 'kernel_transaction_request',
          transaction_hash: '',
          asset: '',
          amount: '',
          extra: '',
          user_id: '',
          state: '',
          created_at: '',
          updated_at: '',
          snapshot_id: '',
          snapshot_hash: '',
          snapshot_at: '',
          receivers: [],
          senders: [],
          senders_hash: '',
          senders_threshold: 0,
          signers: [],
          views: [],
        },
      ];

      jest.spyOn(service, 'getAssetIdFromMixin').mockResolvedValue(asset_id);
      jest.spyOn(service, 'sendMixinTx').mockResolvedValue(transferResult);

      const result = await service.initiateUserTransfer(
        userId,
        tokenSymbol,
        amount,
      );

      expect(service.getAssetIdFromMixin).toHaveBeenCalledWith(tokenSymbol);
      expect(service.sendMixinTx).toHaveBeenCalledWith(
        userId,
        asset_id,
        amount.toString(),
      );
      expect(result).toEqual(transferResult);
    });

    it('should throw error if asset ID is invalid', async () => {
      const userId = 'test_user_id';
      const tokenSymbol = 'INVALID';
      const amount = 1;

      jest
        .spyOn(service, 'getAssetIdFromMixin')
        .mockRejectedValue(
          new Error(
            `Unable to fetch asset ID for token symbol: ${tokenSymbol}`,
          ),
        );

      await expect(
        service.initiateUserTransfer(userId, tokenSymbol, amount),
      ).rejects.toThrowError(
        `Unable to fetch asset ID for token symbol: ${tokenSymbol}`,
      );
    });

    it('should handle error during transfer', async () => {
      const userId = 'test_user_id';
      const tokenSymbol = 'BTC';
      const amount = 1;
      const asset_id = 'test_asset_id';

      jest.spyOn(service, 'getAssetIdFromMixin').mockResolvedValue(asset_id);
      jest
        .spyOn(service, 'sendMixinTx')
        .mockRejectedValue(new Error('Transfer error'));

      await expect(
        service.initiateUserTransfer(userId, tokenSymbol, amount),
      ).rejects.toThrowError('Transfer error: Transfer error');
    });
  });

  describe('getAssetBalance', () => {
    it('should return asset balance', async () => {
      const asset_id = 'test_asset_id';
      const balance = '100';

      mockMixinApi.utxo.safeAssetBalance.mockResolvedValue(balance);

      const result = await service.getAssetBalance(asset_id);

      expect(mockMixinApi.utxo.safeAssetBalance).toHaveBeenCalledWith({
        asset: asset_id,
      });
      expect(result).toEqual(balance);
    });

    it('should handle error when fetching balance', async () => {
      const asset_id = 'test_asset_id';
      const error = new Error('Test error');

      mockMixinApi.utxo.safeAssetBalance.mockRejectedValue(error);

      const result = await service.getAssetBalance(asset_id);

      expect(mockLogger.error).toHaveBeenCalledWith(
        `Mixin getAssetBalance() => ${error}`,
      );
      expect(result).toEqual('0');
    });
  });

  describe('checkMixinBalanceEnough', () => {
    it('should return true if balance is enough', async () => {
      const asset_id = 'test_asset_id';
      const amount = '50';
      const balance = '100';

      jest.spyOn(service, 'getAssetBalance').mockResolvedValue(balance);

      const result = await service.checkMixinBalanceEnough(asset_id, amount);

      expect(service.getAssetBalance).toHaveBeenCalledWith(asset_id);
      expect(result).toBe(true);
    });

    it('should return false if balance is not enough', async () => {
      const asset_id = 'test_asset_id';
      const amount = '150';
      const balance = '100';

      jest.spyOn(service, 'getAssetBalance').mockResolvedValue(balance);

      const result = await service.checkMixinBalanceEnough(asset_id, amount);

      expect(service.getAssetBalance).toHaveBeenCalledWith(asset_id);
      expect(result).toBe(false);
    });

    it('should return false if error occurs', async () => {
      const asset_id = 'test_asset_id';
      const amount = '50';

      jest
        .spyOn(service, 'getAssetBalance')
        .mockRejectedValue(new Error('Test error'));

      const result = await service.checkMixinBalanceEnough(asset_id, amount);

      expect(service.getAssetBalance).toHaveBeenCalledWith(asset_id);
      expect(result).toBe(false);
    });
  });

  describe('handleSnapshot', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return if snapshot already exists', async () => {
      const snapshot = { snapshot_id: 'test_snapshot_id' } as any;
      mockSnapshotsRepository.checkSnapshotExist.mockResolvedValue(true);

      await service['handleSnapshot'](snapshot);

      expect(mockSnapshotsRepository.checkSnapshotExist).toHaveBeenCalledWith(
        snapshot.snapshot_id,
      );
      expect(mockSnapshotsRepository.createSnapshot).not.toHaveBeenCalled();
    });

    it('should handle snapshot with no memo', async () => {
      const snapshot = {
        snapshot_id: 'test_snapshot_id',
        memo: null,
      } as any;
      mockSnapshotsRepository.checkSnapshotExist.mockResolvedValue(false);
      jest.spyOn(service, 'createSnapshot').mockResolvedValue(undefined);

      await service['handleSnapshot'](snapshot);

      expect(mockSnapshotsRepository.checkSnapshotExist).toHaveBeenCalledWith(
        snapshot.snapshot_id,
      );
      expect(service.createSnapshot).toHaveBeenCalledWith(snapshot);
      expect(mockLogger.warn).toHaveBeenCalledWith('snapshot no memo, return');
    });

    it('should handle snapshot with empty memo', async () => {
      const snapshot = {
        snapshot_id: 'test_snapshot_id',
        memo: '',
      } as any;
      mockSnapshotsRepository.checkSnapshotExist.mockResolvedValue(false);
      jest.spyOn(service, 'createSnapshot').mockResolvedValue(undefined);

      await service['handleSnapshot'](snapshot);

      expect(mockSnapshotsRepository.checkSnapshotExist).toHaveBeenCalledWith(
        snapshot.snapshot_id,
      );
      expect(service.createSnapshot).toHaveBeenCalledWith(snapshot);
      expect(mockLogger.warn).toHaveBeenCalledWith('snapshot no memo, return');
    });

    it('should handle unknown memo type', async () => {
      // Prepare a memo with unknown trading type
      const originalMemo = 'XX_order123';
      const base64Memo = Buffer.from(originalMemo).toString('base64');
      const hexMemo = Buffer.from(base64Memo).toString('hex');

      const snapshot = {
        snapshot_id: 'test_snapshot_id',
        memo: hexMemo,
      } as any;
      mockSnapshotsRepository.checkSnapshotExist.mockResolvedValue(false);
      jest.spyOn(service, 'createSnapshot').mockResolvedValue(undefined);

      await service['handleSnapshot'](snapshot);

      expect(mockSnapshotsRepository.checkSnapshotExist).toHaveBeenCalledWith(
        snapshot.snapshot_id,
      );
      expect(service.createSnapshot).toHaveBeenCalledWith(snapshot);
    });
  });

  describe('handleSnapshots', () => {
    it('should fetch and process snapshots when cron is enabled', async () => {
      jest
        .spyOn(service, 'fetchAndProcessSnapshots')
        .mockResolvedValue(undefined);

      await service.handleSnapshots();

      expect(service.fetchAndProcessSnapshots).toHaveBeenCalled();
    });

    it('should not fetch snapshots when cron is disabled', async () => {
      // Override the readonly property 'enableCron' using Object.defineProperty
      Object.defineProperty(service, 'enableCron', {
        value: false,
      });
      jest
        .spyOn(service, 'fetchAndProcessSnapshots')
        .mockResolvedValue(undefined);

      await service.handleSnapshots();

      expect(service.fetchAndProcessSnapshots).not.toHaveBeenCalled();
    });
  });
});
