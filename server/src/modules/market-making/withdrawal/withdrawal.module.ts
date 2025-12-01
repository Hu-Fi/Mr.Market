import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Withdrawal } from 'src/common/entities/withdrawal.entity';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalProcessor } from './withdrawal.processor';
import { MixinModule } from '../../mixin/mixin.module'; // Assuming we need Mixin services
import { LoggerModule } from '../../infrastructure/logger/logger.module';
import { UserOrdersModule } from '../user-orders/user-orders.module';
import { UserWithdrawalController } from './user-withdrawal.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Withdrawal]),
    BullModule.registerQueue({
      name: 'withdrawals',
    }),
    forwardRef(() => MixinModule),
    LoggerModule,
    UserOrdersModule,
  ],
  controllers: [UserWithdrawalController],
  providers: [WithdrawalService, WithdrawalProcessor],
  exports: [WithdrawalService],
})
export class WithdrawalModule { }
