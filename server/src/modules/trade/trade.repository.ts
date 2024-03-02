// In trade.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trade } from '../../common/entities/trade.entity';

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

    const transaction = this.repository.create(transactionData);
    return this.repository.save(transaction);
  }


  async updateTradeStatus(orderId: string, status: string): Promise<void> {

    await this.repository.update({ orderId }, { status });
  }
  // Add more custom methods as needed...
}