// src/transactions/transactions.service.ts
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/common/entities/transaction.entity';
import { UserBalance } from 'src/common/entities/user-balance.entity';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(UserBalance)
    private userBalanceRepository: Repository<UserBalance>,
  ) {}

  async createDeposit(
    userId: string,
    amount: number,
    currency: string,
    exchange: string,
  ): Promise<Transaction> {
    // Create and save the deposit transaction
    const deposit = this.transactionRepository.create({
      userId,
      amount,
      currency,
      exchange,
      type: 'deposit',
      status: 'completed',
    });
    await this.transactionRepository.save(deposit);

    // Update the user's balance
    await this.updateBalance(userId, exchange, currency, amount);

    return deposit;
  }

  //   async createWithdrawal(userId: string, amount: number, currency: string, exchange: string): Promise<Transaction> {
  //     // Similar to createDeposit, but ensure the user has enough balance before proceeding
  //     // Create and save the withdrawal transaction
  //     // Update the user's balance by subtracting the amount
  //   }

  private async updateBalance(
    userId: string,
    exchange: string,
    currency: string,
    amount: number,
  ): Promise<void> {
    let userBalance = await this.userBalanceRepository.findOne({
      where: { userId, exchange, currency },
    });

    if (!userBalance) {
      userBalance = this.userBalanceRepository.create({
        userId,
        exchange,
        currency,
        balance: 0,
      });
    }

    userBalance.balance += amount; // Subtract for withdrawals, ensure no negative balance
    await this.userBalanceRepository.save(userBalance);
  }
}
