import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MixinClientService } from './mixin-client.service';

@Module({
  imports: [ConfigModule],
  providers: [MixinClientService],
  exports: [MixinClientService],
})
export class MixinClientModule { }
