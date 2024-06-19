import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MixinUser } from 'src/common/entities/mixin-user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(MixinUser)
    private readonly userRepository: Repository<MixinUser>,
  ) {}

  async addUser(user: Partial<MixinUser>) {
    return this.userRepository.save(user);
  }

  async removeUserById(user_id: string) {
    const user = await this.userRepository.findOne({
      where: { user_id },
    });
    if (!user) {
      // Handle key not found error
      return;
    }
    await this.userRepository.remove(user);
  }

  async checkUserExist(user_id: string) {
    return await this.userRepository.exists({
      where: { user_id },
    });
  }

  async getAllUsers(): Promise<MixinUser[]> {
    return await this.userRepository.find();
  }

  async updateUser(user_id: string, updateData: Partial<MixinUser>) {
    return this.userRepository.update({ user_id }, updateData);
  }
}
