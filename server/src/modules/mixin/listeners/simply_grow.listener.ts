// import { Injectable } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
// import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
// import { getRFC3339Timestamp } from 'src/common/helpers/utils';
// import { SimplyGrowCreateMemoDetails } from 'src/common/types/memo/memo';
// import { StrategyUserService } from 'src/modules/strategy/strategy-user.service';
// import { CustomLogger } from 'src/modules/logger/logger.service';

// @Injectable()
// export class SimplyGrowListener {
//   constructor(
//     private readonly strategyUserService: StrategyUserService,
//     private readonly logger: CustomLogger,
//   ) {
//     this.logger = new CustomLogger(SimplyGrowListener.name);
//   }

//   @OnEvent('simply_grow.create')
//   async handleSimplyGrowCreate(
//     details: SimplyGrowCreateMemoDetails,
//     snapshot: SafeSnapshot,
//   ) {
//     if (!details || !snapshot) {
//       this.logger.error('Invalid arguments passed to handleSimplyGrowCreate');
//       return;
//     }
//     this.logger.debug(`Simply grow details: ${JSON.stringify(details)}`);
//     await this.strategyUserService.createSimplyGrow({
//       orderId: details.orderId,
//       userId: snapshot.opponent_id,
//       mixinAssetId: snapshot.asset_id,
//       amount: snapshot.amount,
//       state: 'created',
//       createdAt: getRFC3339Timestamp(),
//       rewardAddress: details.rewardAddress,
//     });
//   }
// }
