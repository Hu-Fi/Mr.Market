import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/modules/mixin/user/user.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CustomLogger } from 'src/modules/logger/logger.service';

@ApiTags('admin/user')
@Controller('admin/user')
@UseGuards(JwtAuthGuard)
export class AdminUserController {
  private readonly logger = new CustomLogger(AdminUserController.name);

  constructor(private userService: UserService) {}

  @Get('/all')
  @ApiResponse({ status: 200, description: 'Retrieved all users successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      return {
        code: HttpStatus.OK,
        data: users,
      };
    } catch (error) {
      this.logger.error('Failed to retrieve users', error.message);
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error retrieving users: ${error.message}`,
      };
    }
  }
}
