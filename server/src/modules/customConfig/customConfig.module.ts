import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomConfigService } from './customConfig.service';
import { CustomConfigRepository } from './customConfig.repository';
import { CustomConfigEntity } from 'src/common/entities/custom-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomConfigEntity])],
  providers: [CustomConfigService, CustomConfigRepository],
  exports: [CustomConfigService, CustomConfigRepository],
})
export class CustomConfigModule {}
