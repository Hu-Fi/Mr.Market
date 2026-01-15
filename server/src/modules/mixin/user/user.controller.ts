import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Mixin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mixin/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<MixinUser[]> {
    return this.userService.getAllUsers();
  }
}
