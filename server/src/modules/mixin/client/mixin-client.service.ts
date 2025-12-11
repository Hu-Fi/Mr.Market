import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MixinApi,
  Keystore,
  KeystoreClientReturnType,
} from '@mixin.dev/mixin-node-sdk';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

@Injectable()
export class MixinClientService {
  public readonly keystore: Keystore;
  public readonly client: KeystoreClientReturnType;
  public readonly spendKey: string;
  private readonly logger = new CustomLogger(MixinClientService.name);

  constructor(private readonly configService: ConfigService) {
    const app_id = this.configService.get<string>('mixin.app_id');
    const session_id = this.configService.get<string>('mixin.session_id');
    const server_public_key = this.configService.get<string>(
      'mixin.server_public_key',
    );
    const session_private_key = this.configService.get<string>(
      'mixin.session_private_key',
    );
    const spend_private_key = this.configService.get<string>(
      'mixin.spend_private_key',
    );
    if (!app_id || !session_id || !server_public_key || !session_private_key) {
      this.logger.warn('Mixin bot configuration is missing');
      return;
    }
    this.keystore = {
      app_id,
      session_id,
      server_public_key,
      session_private_key,
    };
    this.spendKey = spend_private_key;

    this.client = MixinApi({
      keystore: this.keystore,
    });
    this.logger.log('Mixin bot client initialized');
  }
}
