import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Web3Service } from './web3.service';

@Module({
  providers: [ConfigService, Web3Service],
  exports: [Web3Service],
})
export class Web3Module {}
