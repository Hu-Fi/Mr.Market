// admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class AdminController {
  @Get('/admin')
  getAdminData() {
    return 'This is admin data';
  }

  @Get('/config')
  getConfigData() {
    return 'This is config data';
  }
}
