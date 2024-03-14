// exchange.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeService } from './exchange.service';
import { ExchangeRepository } from './exchange.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRepository])],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
