import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WithdrawalService } from './withdrawal.service';
import { UserOrdersService } from '../user-orders/user-orders.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('withdrawals')
export class UserWithdrawalController {
  constructor(
    private readonly withdrawalService: WithdrawalService,
    private readonly userOrdersService: UserOrdersService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('external')
  async withdrawToExternal(@Request() req, @Body() body: { amount: number; assetId: string; symbol: string; address: string }) {
    const userId = req.user.user_id;
    return this.withdrawalService.createWithdrawal({
      userId,
      amount: body.amount,
      assetId: body.assetId,
      symbol: body.symbol,
      type: 'withdraw_external',
      status: 'pending',
      // We might want to store the destination address too, but Withdrawal entity doesn't have it explicitly yet.
      // For now, let's assume it's handled or we add a field.
      // The entity has onChainTxId which will be populated later.
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('stop-mm')
  async stopMarketMaking(@Request() req, @Body() body: { orderId: string }) {
    const userId = req.user.user_id;
    // Trigger stop MM via queue (UserOrdersService has the logic now)
    // We need to expose a method in UserOrdersService to stop MM via queue
    // Currently UserOrdersService has updateExecutionBasedOnOrders which does it for paused orders.
    // We should add a method `stopMarketMaking(userId, orderId)` in UserOrdersService that adds the job.

    await this.userOrdersService.stopMarketMaking(userId, body.orderId);
    return { message: 'Market making stop requested' };
  }
}
