import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { Withdrawal } from 'src/common/entities/withdrawal.entity';
import { WithdrawalService } from './withdrawal.service';
import { WithdrawalProcessor } from './withdrawal.processor';
import { WithdrawalConfirmationWorker } from './withdrawal-confirmation.worker';
import { MixinClientModule } from '../client/mixin-client.module';
import { SnapshotsModule } from '../snapshots/snapshots.module';
import { Queue } from 'bull';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Withdrawal]),
        BullModule.registerQueue(
            {
                name: 'withdrawals',
            },
            {
                name: 'withdrawal-confirmations',
            },
        ),
        MixinClientModule,
        SnapshotsModule,
    ],
    providers: [
        ConfigService,
        WithdrawalService,
        WithdrawalProcessor,
        WithdrawalConfirmationWorker,
    ],
    exports: [WithdrawalService, BullModule],
})
export class WithdrawalModule implements OnApplicationBootstrap {
    private readonly logger = new CustomLogger(WithdrawalModule.name);
    private readonly enableConfirmationWorker: boolean;

    constructor(
        private configService: ConfigService,
        @InjectQueue('withdrawal-confirmations')
        private confirmationQueue: Queue,
    ) {
        this.enableConfirmationWorker =
            this.configService.get<string>(
                'strategy.mixin_withdrawal_confirmation_run',
            ) === 'true';
    }

    async onApplicationBootstrap() {
        if (this.enableConfirmationWorker) {
            this.logger.log('Starting withdrawal confirmation worker...');
            await this.confirmationQueue.add(
                'check_withdrawal_confirmations',
                {},
                {
                    removeOnComplete: true,
                },
            );
        } else {
            this.logger.log('Withdrawal confirmation worker is disabled');
        }
    }
}
