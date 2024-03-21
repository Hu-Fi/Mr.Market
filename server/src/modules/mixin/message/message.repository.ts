import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MixinMessage } from 'src/common/entities/mixin-message.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MixinMessage)
    private readonly messageRepository: Repository<MixinMessage>,
  ) {}

  async addMessageHistory(message: MixinMessage) {
    return this.messageRepository.save(message);
  }

  async removeMessageById(message_id: string) {
    const message = await this.messageRepository.findOne({
      where: { message_id },
    });
    if (!message) {
      // Handle key not found error
      return;
    }
    await this.messageRepository.remove(message);
  }

  async checkMessageExist(message_id: string) {
    return await this.messageRepository.exists({
      where: { message_id },
    });
  }

  async getAllMessages(): Promise<MixinMessage[]> {
    return await this.messageRepository.find();
  }
}
