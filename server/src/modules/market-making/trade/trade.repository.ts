// In trade.repository.ts
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from 'src/common/entities/trade.entity';

@Injectable()
export class TradeRepository {
  constructor(
    @InjectRepository(Trade)
    private readonly repository: Repository<Trade>,
  ) {}

  async findTradesByUser(userId: string): Promise<Trade[]> {
    return this.repository.find({ where: { userId } });
  }

  async findTradesByClient(clientId: string): Promise<Trade[]> {
    return this.repository.find({ where: { clientId } });
  }

  async createTrade(transactionData: Partial<Trade>): Promise<Trade> {
    // Convert numeric amount and price to strings for SQLite storage
    const dataToSave = {
      ...transactionData,
      amount: transactionData.amount?.toString() ?? '0',
      price: transactionData.price?.toString() ?? '0',
    };
    const transaction = this.repository.create(dataToSave);
    return this.repository.save(transaction);
  }

  async updateTradeStatus(orderId: string, status: string): Promise<void> {
    await this.repository.update({ orderId }, { status });
  }
}
