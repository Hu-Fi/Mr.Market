import { Module } from '@nestjs/common';
import { NetworkMappingService } from './network-mapping.service';
import { MixinClientModule } from 'src/modules/mixin/client/mixin-client.module';

@Module({
    imports: [MixinClientModule],
    providers: [NetworkMappingService],
    exports: [NetworkMappingService],
})
export class NetworkMappingModule { }
