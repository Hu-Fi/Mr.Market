import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/common/entities/transaction.entity';
import { UserBalance } from 'src/common/entities/user-balance.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction]),TypeOrmModule.forFeature([UserBalance])],
    providers: [TransactionsService],
    exports: [TransactionsService] 
})
export class TransactionsModule {
    
}
