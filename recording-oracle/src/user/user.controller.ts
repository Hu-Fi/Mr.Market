import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpUserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() signUpUserDto: SignUpUserDto) {
    const { userId, apiKey, secret, campaignAddress } = signUpUserDto;
    const user = await this.userService.signUp(userId, apiKey, secret, campaignAddress);
    return { message: 'User signed up successfully', userId: user.userId };
  }
}
