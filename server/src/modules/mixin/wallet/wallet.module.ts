import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { MixinClientModule } from '../client/mixin-client.module';

@Module({
  imports: [MixinClientModule],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule { }
