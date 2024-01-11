// In trade.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../common/entities/transaction.entity';

@Injectable()
export class TradeRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
  ) {}

  async findTransactionsByUser(userId: string): Promise<Transaction[]> {
    return this.repository.find({ where: { userId } });
  }

  async findTransactionsByClient(clientId: string): Promise<Transaction[]> {
    return this.repository.find({ where: { clientId } });
  }

  async createTransaction(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.repository.create(transactionData);
    return this.repository.save(transaction);
  }

  async updateTransactionStatus(orderId: string, status: string): Promise<void> {
    await this.repository.update({ orderId }, { status });
  }
  // Add more custom methods as needed...
}
