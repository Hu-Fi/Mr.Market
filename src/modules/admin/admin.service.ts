import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(private configService: ConfigService) {}

  async checkPass(password: string): Promise<boolean> {
    const pass = this.configService.get<string>('admin.pass');
    return pass === password;
  }
}
