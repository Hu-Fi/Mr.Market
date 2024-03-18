import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MixinMessage } from 'src/common/entities/mixin-message.eneity';
import { MessageService } from 'src/modules/mixin/message/message.service';

@Module({
  imports: [TypeOrmModule.forFeature([MixinMessage])],
  providers: [MessageService],
})
export class MessageModule {}
