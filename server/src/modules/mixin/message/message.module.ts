import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MixinMessage } from 'src/common/entities/mixin-message.entity';
import { MessageService } from 'src/modules/mixin/message/message.service';
import { UserService } from 'src/modules/mixin/user/user.service';
import { MessageRepository } from 'src/modules/mixin/message/message.repository';
import { UserModule } from 'src/modules/mixin/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([MixinMessage]), UserModule],
  controllers: [],
  providers: [MessageService, ConfigService, UserService, MessageRepository],
  exports: [MessageService],
})
export class MixinMessageModule {}
