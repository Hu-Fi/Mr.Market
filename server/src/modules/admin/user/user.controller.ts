import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from 'src/modules/mixin/user/user.service';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin/users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class AdminUserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<MixinUser[]> {
    return this.userService.getAllUsers();
  }
}
