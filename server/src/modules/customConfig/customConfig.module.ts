import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomConfigService } from './customConfig.service';
import { CustomConfig } from 'src/common/entities/custom-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomConfig])],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
