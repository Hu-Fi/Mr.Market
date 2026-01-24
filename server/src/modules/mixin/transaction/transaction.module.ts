import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { MixinClientModule } from '../client/mixin-client.module';

@Module({
  imports: [MixinClientModule],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule { }
