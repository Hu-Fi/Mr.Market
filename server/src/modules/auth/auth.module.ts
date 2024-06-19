import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { AuthService } from 'src/modules/auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from 'src/modules/auth/auth.controller';
import { UserModule } from '../mixin/user/user.module';
import { UserService } from '../mixin/user/user.service';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('admin.jwt_secret'),
        signOptions: { expiresIn: '30d' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, ConfigService],
  controllers: [AuthController],
  exports: [AuthService, UserService],
})
export class AuthModule {}
