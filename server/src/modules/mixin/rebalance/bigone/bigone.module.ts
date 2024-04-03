import { Module } from '@nestjs/common';
import { BigoneService } from './bigone.service';

@Module({
  providers: [BigoneService],
  exports: [BigoneService],
})
export class BigoneRebalanceModule {}
