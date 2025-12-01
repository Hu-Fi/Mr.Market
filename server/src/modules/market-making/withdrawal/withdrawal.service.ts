import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Withdrawal } from 'src/common/entities/withdrawal.entity';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

@Injectable()
export class WithdrawalService {
  private readonly logger = new CustomLogger(WithdrawalService.name);

  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
    @InjectQueue('withdrawals') private readonly withdrawalQueue: Queue,
  ) { }

  async createWithdrawal(data: Partial<Withdrawal>): Promise<Withdrawal> {
    const withdrawal = this.withdrawalRepository.create({
      ...data,
      status: 'pending',
    });
    const saved = await this.withdrawalRepository.save(withdrawal);

    // Add job to queue
    await this.withdrawalQueue.add('process_withdrawal', {
      withdrawalId: saved.id,
    });

    return saved;
  }

  async findPendingWithdrawals(): Promise<Withdrawal[]> {
    return this.withdrawalRepository.find({
      where: { status: 'pending' },
    });
  }

  async updateWithdrawal(id: string, update: Partial<Withdrawal>): Promise<void> {
    await this.withdrawalRepository.update(id, update);
  }

  async findById(id: string): Promise<Withdrawal> {
    return this.withdrawalRepository.findOneBy({ id });
  }
}
