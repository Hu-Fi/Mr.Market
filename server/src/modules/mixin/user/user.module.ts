import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { UserService } from 'src/modules/mixin/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([MixinUser])],
  providers: [UserService],
})
export class UserModule {}
