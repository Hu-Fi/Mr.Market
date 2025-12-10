import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MixinApi,
  Keystore,
  KeystoreClientReturnType,
} from '@mixin.dev/mixin-node-sdk';

@Injectable()
export class MixinClientService {
  public readonly keystore: Keystore;
  public readonly client: KeystoreClientReturnType;
  public readonly spendKey: string;

  constructor(private readonly configService: ConfigService) {
    this.keystore = {
      app_id: this.configService.get<string>('mixin.app_id'),
      session_id: this.configService.get<string>('mixin.session_id'),
      server_public_key: this.configService.get<string>(
        'mixin.server_public_key',
      ),
      session_private_key: this.configService.get<string>(
        'mixin.session_private_key',
      ),
    };
    // spend_private_key might be optional in some contexts but SnapshotsService uses it.
    this.spendKey = this.configService.get<string>('mixin.spend_private_key');

    this.client = MixinApi({
      keystore: this.keystore,
    });
  }
}
