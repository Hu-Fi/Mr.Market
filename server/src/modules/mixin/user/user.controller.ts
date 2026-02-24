import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { MixinUser } from 'src/common/entities/mixin-user.entity';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiTags('Mixin')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<MixinUser[]> {
    return this.userService.getAllUsers();
  }
}
