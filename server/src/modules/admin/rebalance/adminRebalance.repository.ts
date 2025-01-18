import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  WithdrawalRecord,
  TransferRecord,
  DepositRecord,
} from 'src/common/entities/rebalance.entity';

@Injectable()
export class AdminRebalanceRepository {
  constructor(
    @InjectRepository(WithdrawalRecord)
    private readonly withdrawalRecordRepository: Repository<WithdrawalRecord>,
    @InjectRepository(TransferRecord)
    private readonly transferRecordRepository: Repository<TransferRecord>,
    @InjectRepository(DepositRecord)
    private readonly depositRecordRepository: Repository<DepositRecord>,
  ) {}

  async getWithdrawalRecord(id: string): Promise<WithdrawalRecord | null> {
    return this.withdrawalRecordRepository.findOne({ where: { id } });
  }

  async getTransferRecord(id: string): Promise<TransferRecord | null> {
    return this.transferRecordRepository.findOne({ where: { id } });
  }

  async getDepositRecord(id: string): Promise<DepositRecord | null> {
    return this.depositRecordRepository.findOne({ where: { id } });
  }

  async getAllWithdrawalHistory(): Promise<WithdrawalRecord[]> {
    return this.withdrawalRecordRepository.find();
  }

  async getAllTransferHistory(): Promise<TransferRecord[]> {
    return this.transferRecordRepository.find();
  }

  async getAllDepositHistory(): Promise<DepositRecord[]> {
    return this.depositRecordRepository.find();
  }
}
