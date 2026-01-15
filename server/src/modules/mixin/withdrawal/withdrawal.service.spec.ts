import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { WithdrawalService } from './withdrawal.service';
import { Withdrawal } from 'src/common/entities/withdrawal.entity';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';

describe('WithdrawalService', () => {
  let service: WithdrawalService;
  let repository: Repository<Withdrawal>;
  let queue: Queue;

  const mockWithdrawalRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawalService,
        {
          provide: getRepositoryToken(Withdrawal),
          useValue: mockWithdrawalRepository,
        },
        {
          provide: 'BullQueue_withdrawals',
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<WithdrawalService>(WithdrawalService);
    repository = module.get<Repository<Withdrawal>>(
      getRepositoryToken(Withdrawal),
    );
    queue = module.get<Queue>('BullQueue_withdrawals');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeWithdrawal', () => {
    const mockSnapshot: SafeSnapshot = {
      snapshot_id: 'test-snapshot-id',
      opponent_id: 'test-user-id',
      amount: '100.5',
      asset_id: 'test-asset-id',
      memo: 'test-memo',
      created_at: '2024-01-01T00:00:00Z',
    } as any;

    const mockMemoDetails = {
      version: 1,
      tradingType: 'Withdrawal',
      destination: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      destinationTag: undefined,
      assetId: 'test-asset-id',
      amount: '100.5',
    };

    it('should create a new withdrawal when snapshot is new', async () => {
      mockWithdrawalRepository.findOne.mockResolvedValue(null);
      mockWithdrawalRepository.create.mockReturnValue({
        id: 'test-withdrawal-id',
        ...mockMemoDetails,
      });
      mockWithdrawalRepository.save.mockResolvedValue({
        id: 'test-withdrawal-id',
        ...mockMemoDetails,
      });

      const result = await service.initializeWithdrawal(
        mockSnapshot,
        mockMemoDetails,
      );

      expect(mockWithdrawalRepository.findOne).toHaveBeenCalledWith({
        where: { snapshotId: 'test-snapshot-id' },
      });
      expect(mockWithdrawalRepository.create).toHaveBeenCalled();
      expect(mockWithdrawalRepository.save).toHaveBeenCalled();
      expect(mockQueue.add).toHaveBeenCalledWith(
        'process_withdrawal',
        { withdrawalId: 'test-withdrawal-id' },
        expect.any(Object),
      );
      expect(result).toBeDefined();
      expect(result?.id).toBe('test-withdrawal-id');
    });

    it('should not create duplicate withdrawal for same snapshot', async () => {
      const existingWithdrawal = {
        id: 'existing-withdrawal-id',
        snapshotId: 'test-snapshot-id',
      };
      mockWithdrawalRepository.findOne.mockResolvedValue(existingWithdrawal);

      const result = await service.initializeWithdrawal(
        mockSnapshot,
        mockMemoDetails,
      );

      expect(mockWithdrawalRepository.findOne).toHaveBeenCalledWith({
        where: { snapshotId: 'test-snapshot-id' },
      });
      expect(mockWithdrawalRepository.create).not.toHaveBeenCalled();
      expect(mockWithdrawalRepository.save).not.toHaveBeenCalled();
      expect(mockQueue.add).not.toHaveBeenCalled();
      expect(result).toEqual(existingWithdrawal);
    });

    it('should handle errors gracefully', async () => {
      mockWithdrawalRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.initializeWithdrawal(
        mockSnapshot,
        mockMemoDetails,
      );

      expect(result).toBeNull();
    });
  });

  describe('queueWithdrawal', () => {
    it('should queue withdrawal with correct parameters', async () => {
      const withdrawalId = 'test-withdrawal-id';

      await service.queueWithdrawal(withdrawalId);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'process_withdrawal',
        { withdrawalId },
        expect.objectContaining({
          jobId: withdrawalId,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: true,
        }),
      );
      expect(mockWithdrawalRepository.update).toHaveBeenCalledWith(
        withdrawalId,
        { status: 'queued' },
      );
    });
  });

  describe('updateWithdrawalStatus', () => {
    it('should update withdrawal status', async () => {
      const withdrawalId = 'test-withdrawal-id';
      const newStatus = 'completed';

      await service.updateWithdrawalStatus(withdrawalId, newStatus);

      expect(mockWithdrawalRepository.update).toHaveBeenCalledWith(
        withdrawalId,
        { status: newStatus },
      );
    });

    it('should update withdrawal status with additional data', async () => {
      const withdrawalId = 'test-withdrawal-id';
      const newStatus = 'completed';
      const additionalData = { onChainTxId: 'test-tx-hash' };

      await service.updateWithdrawalStatus(
        withdrawalId,
        newStatus,
        additionalData,
      );

      expect(mockWithdrawalRepository.update).toHaveBeenCalledWith(
        withdrawalId,
        {
          status: newStatus,
          ...additionalData,
        },
      );
    });
  });

  describe('getPendingWithdrawals', () => {
    it('should fetch pending withdrawals', async () => {
      const mockWithdrawals = [
        { id: '1', status: 'processing' },
        { id: '2', status: 'sent' },
      ];
      mockWithdrawalRepository.find.mockResolvedValue(mockWithdrawals);

      const result = await service.getPendingWithdrawals();

      expect(mockWithdrawalRepository.find).toHaveBeenCalledWith({
        where: [
          { status: 'processing' },
          { status: 'sent' },
          { status: 'confirmed' },
        ],
        order: { createdAt: 'ASC' },
      });
      expect(result).toEqual(mockWithdrawals);
    });
  });

  describe('markAsFailed', () => {
    it('should mark withdrawal as failed with error message', async () => {
      const withdrawalId = 'test-withdrawal-id';
      const errorMessage = 'Insufficient balance';

      await service.markAsFailed(withdrawalId, errorMessage);

      expect(mockWithdrawalRepository.update).toHaveBeenCalledWith(
        withdrawalId,
        {
          status: 'failed',
          errorMessage,
        },
      );
    });
  });

  describe('markAsRefunded', () => {
    it('should mark withdrawal as refunded with tx id', async () => {
      const withdrawalId = 'test-withdrawal-id';
      const mixinTxId = 'test-tx-id';

      await service.markAsRefunded(withdrawalId, mixinTxId);

      expect(mockWithdrawalRepository.update).toHaveBeenCalledWith(
        withdrawalId,
        {
          status: 'refunded',
          mixinTxId,
        },
      );
    });
  });

  describe('incrementRetryCount', () => {
    it('should increment retry count', async () => {
      const withdrawalId = 'test-withdrawal-id';
      const mockWithdrawal = { id: withdrawalId, retryCount: 1 };
      mockWithdrawalRepository.findOne.mockResolvedValue(mockWithdrawal);

      await service.incrementRetryCount(withdrawalId);

      expect(mockWithdrawalRepository.update).toHaveBeenCalledWith(
        withdrawalId,
        { retryCount: 2 },
      );
    });

    it('should handle non-existent withdrawal', async () => {
      const withdrawalId = 'non-existent-id';
      mockWithdrawalRepository.findOne.mockResolvedValue(null);

      await service.incrementRetryCount(withdrawalId);

      expect(mockWithdrawalRepository.update).not.toHaveBeenCalled();
    });
  });
});
