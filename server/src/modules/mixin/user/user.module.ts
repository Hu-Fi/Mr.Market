import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { UserService } from 'src/modules/mixin/user/user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

import { MixinClientModule } from '../client/mixin-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([MixinUser]), MixinClientModule],
  providers: [UserService, ConfigService, UserRepository],
  exports: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule { }
