import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomConfigService } from './custom-config.service';
import { CustomConfigRepository } from './custom-config.repository';
import { CustomConfigEntity } from 'src/common/entities/custom-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomConfigEntity])],
  providers: [CustomConfigService, CustomConfigRepository],
  exports: [CustomConfigService, CustomConfigRepository],
})
export class CustomConfigModule {}
