import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserOrdersService } from './user-orders.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';
import { StrategyService } from '../strategy/strategy.service';
import { createStrategyKey } from 'src/common/helpers/strategyKey';
import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';
import { MarketMakingCreateMemoDetails } from 'src/common/types/memo/memo';
import BigNumber from 'bignumber.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketMakingOrder, PaymentState } from 'src/common/entities/user-orders.entity';
import { FeeService } from '../fee/fee.service';
import { GrowdataRepository } from 'src/modules/data/grow-data/grow-data.repository';
import { PriceSourceType } from 'src/common/enum/pricesourcetype';
import { SnapshotsService } from 'src/modules/mixin/snapshots/snapshots.service';
import { WithdrawalService } from 'src/modules/mixin/withdrawal/withdrawal.service';
import { LocalCampaignService } from '../local-campaign/local-campaign.service';
import { CampaignService } from 'src/modules/campaign/campaign.service';
import { ExchangeService } from 'src/modules/mixin/exchange/exchange.service';
import { NetworkMappingService } from '../network-mapping/network-mapping.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MixinClientService } from 'src/modules/mixin/client/mixin-client.service';

interface ProcessSnapshotJobData {
  snapshotId: string;
  orderId: string;
  marketMakingPairId: string;
  memoDetails: MarketMakingCreateMemoDetails;
  snapshot: SafeSnapshot;
}

interface CheckPaymentJobData {
  orderId: string;
  marketMakingPairId: string;
  retryCount?: number;
}

interface WithdrawJobData {
  orderId: string;
  marketMakingPairId: string;
}

@Processor('market-making')
export class MarketMakingOrderProcessor {
  private readonly logger = new CustomLogger(MarketMakingOrderProcessor.name);
  private readonly PAYMENT_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_PAYMENT_RETRIES = 60; // Check every 10 seconds for 10 minutes

  constructor(
    private readonly userOrdersService: UserOrdersService,
    private readonly strategyService: StrategyService,
    private readonly feeService: FeeService,
    private readonly growDataRepository: GrowdataRepository,
    private readonly snapshotsService: SnapshotsService,
    private readonly withdrawalService: WithdrawalService,
    private readonly localCampaignService: LocalCampaignService,
    private readonly hufiCampaignService: CampaignService,
    private readonly exchangeService: ExchangeService,
    private readonly networkMappingService: NetworkMappingService,
    private readonly mixinClientService: MixinClientService,
    @InjectRepository(PaymentState)
    private readonly paymentStateRepository: Repository<PaymentState>,
    @InjectRepository(MarketMakingOrder)
    private readonly marketMakingRepository: Repository<MarketMakingOrder>,
    @InjectQueue('withdrawal-confirmations')
    private readonly withdrawalConfirmationQueue: Queue,
  ) { }

  private readonly WITHDRAWAL_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  private readonly RETRY_DELAY_MS = 30000; // 30 seconds

  /**
   * Helper: Refund user
   */
  private async refundUser(snapshot: SafeSnapshot, reason: string) {
    this.logger.warn(`Refunding snapshot ${snapshot.snapshot_id}: ${reason}`);
    try {
      await this.snapshotsService.refund(snapshot);
    } catch (error) {
      this.logger.error(`Failed to refund: ${error.message}`);
    }
  }

  private async refundPaymentState(
    orderId: string,
    paymentState: PaymentState,
    reason: string,
  ) {
    const order = await this.marketMakingRepository.findOne({
      where: { orderId },
    });

    if (!order?.userId) {
      this.logger.error(`Refund failed: order ${orderId} not found`);
      return;
    }

    const refundMap = new Map<string, BigNumber>();
    const addRefund = (assetId?: string | null, amount?: string | null) => {
      if (!assetId || !amount) return;
      const amountValue = new BigNumber(amount);
      if (amountValue.isLessThanOrEqualTo(0)) return;
      const existing = refundMap.get(assetId) || new BigNumber(0);
      refundMap.set(assetId, existing.plus(amountValue));
    };

    addRefund(paymentState.baseAssetId, paymentState.baseAssetAmount);
    addRefund(paymentState.quoteAssetId, paymentState.quoteAssetAmount);
    addRefund(paymentState.baseFeeAssetId, paymentState.baseFeeAssetAmount);
    addRefund(paymentState.quoteFeeAssetId, paymentState.quoteFeeAssetAmount);

    if (refundMap.size === 0) {
      this.logger.warn(`No refundable amounts for order ${orderId}`);
      return;
    }

    this.logger.warn(`Refunding order ${orderId}: ${reason}`);

    for (const [assetId, amount] of refundMap.entries()) {
      try {
        this.logger.log(
          `Refunding ${amount.toString()} of asset ${assetId} to user ${order.userId}`,
        );
        const requests = await this.snapshotsService.sendMixinTx(
          order.userId,
          assetId,
          amount.toString(),
        );
        if (!requests || requests.length === 0) {
          this.logger.error(
            `Refund transaction failed for order ${orderId}, asset ${assetId}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Refund failed for order ${orderId}, asset ${assetId}: ${error.message}`,
        );
      }
    }
  }

  /**
   * Step 1: Process incoming market making snapshot
   * - Validate memo and trading pair
   * - Calculate required fees
   * - Create/update payment state tracking all 4 possible transfers
   * - Queue payment completion check
   */
  @Process('process_mm_snapshot')
  async handleProcessMMSnapshot(job: Job<ProcessSnapshotJobData>) {
    const { snapshotId, orderId, marketMakingPairId, snapshot } = job.data;

    this.logger.log(
      `Processing MM snapshot ${snapshotId} for order ${orderId}`,
    );

    try {
      // Step 1.1: Validate trading pair exists
      const pairConfig = await this.growDataRepository.findMarketMakingPairById(
        marketMakingPairId,
      );

      if (!pairConfig) {
        this.logger.error(
          `Market making pair ${marketMakingPairId} not found`,
        );
        await this.refundUser(snapshot, 'Trading pair not found');
        return;
      }

      if (!pairConfig.enable) {
        this.logger.error(
          `Market making pair ${marketMakingPairId} is disabled`,
        );
        await this.refundUser(snapshot, 'Trading pair disabled');
        return;
      }

      this.logger.log(
        `Validated pair: ${pairConfig.exchange_id} ${pairConfig.symbol}`,
      );

      // Step 1.2: Calculate required fees
      const feeInfo = await this.feeService.calculateMoveFundsFee(
        pairConfig.exchange_id,
        pairConfig.symbol,
        'deposit_to_exchange',
      );

      if (!feeInfo) {
        this.logger.error('Failed to calculate fees');
        await this.refundUser(snapshot, 'Fee calculation failed');
        return;
      }

      const baseFeeAssetId = feeInfo.base_fee_id;
      const quoteFeeAssetId = feeInfo.quote_fee_id;
      const requiredBaseFee = feeInfo.base_fee_amount;
      const requiredQuoteFee = feeInfo.quote_fee_amount;
      const marketMakingFeePercentage = feeInfo.market_making_fee_percentage;

      this.logger.log(
        `Fees - Base: ${requiredBaseFee} (${baseFeeAssetId}), Quote: ${requiredQuoteFee} (${quoteFeeAssetId}), MM Fee: ${marketMakingFeePercentage}%`,
      );

      // Step 1.3: Determine which asset was received
      const receivedAssetId = snapshot.asset_id;
      const receivedAmount = snapshot.amount;
      const userId = snapshot.opponent_id;

      // Step 1.4: Find or create payment state
      let paymentState = await this.paymentStateRepository.findOne({
        where: { orderId },
      });

      if (!paymentState) {
        // First transfer - create payment state
        this.logger.log(`Creating payment state for order ${orderId}`);

        paymentState = this.paymentStateRepository.create({
          orderId,
          type: 'market_making',
          symbol: pairConfig.symbol,
          baseAssetId: pairConfig.base_asset_id,
          baseAssetAmount: '0',
          baseAssetSnapshotId: null,
          quoteAssetId: pairConfig.quote_asset_id,
          quoteAssetAmount: '0',
          quoteAssetSnapshotId: null,
          baseFeeAssetId: baseFeeAssetId,
          baseFeeAssetAmount: '0',
          baseFeeAssetSnapshotId: null,
          quoteFeeAssetId: quoteFeeAssetId,
          quoteFeeAssetAmount: '0',
          quoteFeeAssetSnapshotId: null,
          requiredBaseWithdrawalFee: requiredBaseFee,
          requiredQuoteWithdrawalFee: requiredQuoteFee,
          requiredMarketMakingFee: marketMakingFeePercentage,
          state: 'payment_pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Create MarketMakingOrder
        const mmOrder = this.marketMakingRepository.create({
          orderId,
          userId,
          pair: pairConfig.symbol,
          exchangeName: pairConfig.exchange_id,
          state: 'payment_pending',
          createdAt: new Date().toISOString(),
          // Defaults - should be updated from frontend/memo
          bidSpread: '0.001',
          askSpread: '0.001',
          orderAmount: '0',
          orderRefreshTime: '10000',
          numberOfLayers: '1',
          priceSourceType: PriceSourceType.MID_PRICE,
          amountChangePerLayer: '0',
          amountChangeType: 'fixed',
        });
        await this.marketMakingRepository.save(mmOrder);
      }

      // Step 1.5: Update payment state based on received asset
      let updated = false;

      if (receivedAssetId === pairConfig.base_asset_id) {
        // Base asset received
        paymentState.baseAssetAmount = BigNumber(paymentState.baseAssetAmount)
          .plus(receivedAmount)
          .toString();
        if (!paymentState.baseAssetSnapshotId) {
          paymentState.baseAssetSnapshotId = snapshotId;
        }
        updated = true;
        this.logger.log(`Base asset received: ${receivedAmount}`);
      } else if (receivedAssetId === pairConfig.quote_asset_id) {
        // Quote asset received
        paymentState.quoteAssetAmount = BigNumber(paymentState.quoteAssetAmount)
          .plus(receivedAmount)
          .toString();
        if (!paymentState.quoteAssetSnapshotId) {
          paymentState.quoteAssetSnapshotId = snapshotId;
        }
        updated = true;
        this.logger.log(`Quote asset received: ${receivedAmount}`);
      } else if (receivedAssetId === baseFeeAssetId) {
        // Base fee asset received
        paymentState.baseFeeAssetAmount = BigNumber(paymentState.baseFeeAssetAmount)
          .plus(receivedAmount)
          .toString();
        if (!paymentState.baseFeeAssetSnapshotId) {
          paymentState.baseFeeAssetSnapshotId = snapshotId;
        }
        updated = true;
        this.logger.log(`Base fee asset received: ${receivedAmount}`);
      } else if (receivedAssetId === quoteFeeAssetId) {
        // Quote fee asset received
        paymentState.quoteFeeAssetAmount = BigNumber(paymentState.quoteFeeAssetAmount)
          .plus(receivedAmount)
          .toString();
        if (!paymentState.quoteFeeAssetSnapshotId) {
          paymentState.quoteFeeAssetSnapshotId = snapshotId;
        }
        updated = true;
        this.logger.log(`Quote fee asset received: ${receivedAmount}`);
      } else {
        // Unknown asset
        this.logger.error(
          `Unknown asset ${receivedAssetId} received for order ${orderId}`,
        );
        await this.refundUser(snapshot, 'Unknown asset');
        return;
      }

      if (updated) {
        paymentState.updatedAt = new Date().toISOString();
        await this.paymentStateRepository.save(paymentState);
      }

      // Step 1.6: Queue payment completion check
      await (job.queue as any).add(
        'check_payment_complete',
        {
          orderId,
          marketMakingPairId,
          retryCount: 0,
        } as CheckPaymentJobData,
        {
          jobId: `check_payment_${orderId}_${Date.now()}`,
          delay: 5000,
          attempts: 1,
          removeOnComplete: false,
        },
      );

      this.logger.log(`Queued payment check for order ${orderId}`);
    } catch (error) {
      this.logger.error(
        `Error processing MM snapshot ${snapshotId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }


  /**
   * Step 2: Check if payment is complete
   * - Verify all 4 assets received with sufficient amounts
   * - Calculate and verify total fees
   * - Queue withdrawal if complete
   */
  @Process('check_payment_complete')
  async handleCheckPaymentComplete(job: Job<CheckPaymentJobData>) {
    const { orderId, marketMakingPairId, retryCount = 0 } = job.data;

    this.logger.log(`Checking payment for order ${orderId} (retry ${retryCount})`);

    try {
      const paymentState = await this.paymentStateRepository.findOne({
        where: { orderId },
      });

      if (!paymentState) {
        this.logger.error(`Payment state not found for order ${orderId}`);
        return;
      }

      const pairConfig = await this.growDataRepository.findMarketMakingPairById(
        marketMakingPairId,
      );

      if (!pairConfig) {
        this.logger.error(`Pair config not found: ${marketMakingPairId}`);
        return;
      }

      // Check if all required assets received
      const hasBase = BigNumber(paymentState.baseAssetAmount).isGreaterThan(0);
      const hasQuote = BigNumber(paymentState.quoteAssetAmount).isGreaterThan(0);

      // Check fees (comparing with required amounts)
      const hasBaseFee = BigNumber(paymentState.baseFeeAssetAmount).isGreaterThanOrEqualTo(
        paymentState.requiredBaseWithdrawalFee || 0,
      );
      const hasQuoteFee = BigNumber(paymentState.quoteFeeAssetAmount).isGreaterThanOrEqualTo(
        paymentState.requiredQuoteWithdrawalFee || 0,
      );

      // Calculate required market making fee
      const totalPaidBase = BigNumber(paymentState.baseAssetAmount);
      const totalPaidQuote = BigNumber(paymentState.quoteAssetAmount);
      const mmFeePercentage = BigNumber(paymentState.requiredMarketMakingFee || 0);

      // Note: Market making fee is usually deducted from the paid amounts
      // Here we assume user needs to pay extra or it's included

      if (!hasBase || !hasQuote) {
        // Payment incomplete - assets
        const elapsed = Date.now() - new Date(paymentState.createdAt).getTime();

        if (elapsed > this.PAYMENT_TIMEOUT_MS) {
          this.logger.error(`Payment timeout for order ${orderId}`);
          await this.userOrdersService.updateMarketMakingOrderState(
            orderId,
            'failed',
          );
          await this.refundPaymentState(
            orderId,
            paymentState,
            'payment timeout',
          );
          return;
        }

        if (retryCount >= this.MAX_PAYMENT_RETRIES) {
          this.logger.error(`Max retries for order ${orderId}`);
          await this.userOrdersService.updateMarketMakingOrderState(
            orderId,
            'failed',
          );
          await this.refundPaymentState(
            orderId,
            paymentState,
            'max payment retries exceeded',
          );
          return;
        }

        // Re-queue check
        await (job.queue as any).add(
          'check_payment_complete',
          {
            orderId,
            marketMakingPairId,
            retryCount: retryCount + 1,
          } as CheckPaymentJobData,
          {
            jobId: `check_payment_${orderId}_${retryCount + 1}_${Date.now()}`,
            delay: 10000,
            attempts: 1,
            removeOnComplete: false,
          },
        );

        this.logger.log(
          `Payment incomplete for ${orderId} (base: ${hasBase}, quote: ${hasQuote}), retrying...`,
        );
        return;
      }

      // Check fees
      if (!hasBaseFee || !hasQuoteFee) {
        this.logger.warn(
          `Insufficient fees for order ${orderId} (baseFee: ${hasBaseFee}, quoteFee: ${hasQuoteFee})`,
        );
        // Could either wait or reject
        // For now, let's fail and refund
        await this.userOrdersService.updateMarketMakingOrderState(
          orderId,
          'failed',
        );
        await this.refundPaymentState(orderId, paymentState, 'insufficient fees');
        return;
      }

      // All payments complete!
      this.logger.log(
        `Payment complete for order ${orderId}. Base: ${paymentState.baseAssetAmount}, Quote: ${paymentState.quoteAssetAmount}`,
      );

      paymentState.state = 'payment_complete';
      paymentState.updatedAt = new Date().toISOString();
      await this.paymentStateRepository.save(paymentState);

      await this.userOrdersService.updateMarketMakingOrderState(
        orderId,
        'payment_complete',
      );

      // Queue withdrawal
      await (job.queue as any).add(
        'withdraw_to_exchange',
        {
          orderId,
          marketMakingPairId,
        } as WithdrawJobData,
        {
          jobId: `withdraw_${orderId}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 10000 },
          removeOnComplete: false,
        },
      );

      this.logger.log(`Payment complete, queued withdrawal for order ${orderId}`);
    } catch (error) {
      this.logger.error(
        `Error checking payment for ${orderId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Step 3: Withdraw to exchange
   */
  @Process('withdraw_to_exchange')
  async handleWithdrawToExchange(job: Job<WithdrawJobData>) {
    const { orderId, marketMakingPairId } = job.data;
    this.logger.log(`Withdrawing to exchange for order ${orderId}`);

    try {
      await this.userOrdersService.updateMarketMakingOrderState(
        orderId,
        'withdrawing',
      );

      const paymentState = await this.paymentStateRepository.findOne({
        where: { orderId },
      });

      const pairConfig = await this.growDataRepository.findMarketMakingPairById(
        marketMakingPairId,
      );

      if (!paymentState || !pairConfig) {
        throw new Error('Payment state or pair config not found');
      }

      const exchangeName = pairConfig.exchange_id;

      // Get API key for this exchange
      const apiKey = await this.exchangeService.findFirstAPIKeyByExchange(
        exchangeName,
      );

      if (!apiKey) {
        throw new Error(`No API key found for exchange ${exchangeName}`);
      }

      this.logger.log(
        `Using API key ${apiKey.key_id} for exchange ${exchangeName}`,
      );

      // Get accurate network identifiers using NetworkMappingService
      this.logger.log(
        `Fetching networks for base=${pairConfig.base_symbol} (${paymentState.baseAssetId}) and quote=${pairConfig.quote_symbol} (${paymentState.quoteAssetId})`,
      );

      const [baseNetwork, quoteNetwork] = await Promise.all([
        this.networkMappingService.getNetworkForAsset(
          paymentState.baseAssetId,
          pairConfig.base_symbol,
        ),
        this.networkMappingService.getNetworkForAsset(
          paymentState.quoteAssetId,
          pairConfig.quote_symbol,
        ),
      ]);

      this.logger.log(
        `Determined networks - Base: ${baseNetwork}, Quote: ${quoteNetwork}`,
      );

      // Get deposit addresses for base and quote assets
      const baseDepositResult = await this.exchangeService.getDepositAddress({
        exchange: exchangeName,
        apiKeyId: apiKey.key_id,
        symbol: pairConfig.base_symbol,
        network: baseNetwork,
      });

      const quoteDepositResult = await this.exchangeService.getDepositAddress({
        exchange: exchangeName,
        apiKeyId: apiKey.key_id,
        symbol: pairConfig.quote_symbol,
        network: quoteNetwork,
      });

      if (!baseDepositResult || !quoteDepositResult) {
        throw new Error(
          `Failed to get deposit addresses for ${pairConfig.base_symbol} or ${pairConfig.quote_symbol}`,
        );
      }

      this.logger.log(
        `Got deposit addresses - Base: ${baseDepositResult.address}, Quote: ${quoteDepositResult.address}`,
      );

      // Withdrawal dry-run for validation
      this.logger.log(
        `Withdrawal dry-run for order ${orderId}: base=${paymentState.baseAssetAmount} ${pairConfig.base_symbol}, quote=${paymentState.quoteAssetAmount} ${pairConfig.quote_symbol}`,
      );

      // Execute withdrawals for base and quote
      // const baseWithdrawalResult = await this.withdrawalService.executeWithdrawal(
      //   paymentState.baseAssetId,
      //   baseDepositResult.address,
      //   baseDepositResult.memo || `MM:${orderId}:base`,
      //   paymentState.baseAssetAmount,
      // );

      // const quoteWithdrawalResult = await this.withdrawalService.executeWithdrawal(
      //   paymentState.quoteAssetId,
      //   quoteDepositResult.address,
      //   quoteDepositResult.memo || `MM:${orderId}:quote`,
      //   paymentState.quoteAssetAmount,
      // );

      // this.logger.log(
      //   `Withdrawals executed for order ${orderId}: base=${baseWithdrawalResult[0]?.request_id}, quote=${quoteWithdrawalResult[0]?.request_id}`,
      // );

      // await this.userOrdersService.updateMarketMakingOrderState(
      //   orderId,
      //   'withdrawal_confirmed',
      // );

      // // Queue confirmation monitoring
      // await this.withdrawalConfirmationQueue.add(
      //   'monitor_mm_withdrawal',
      //   {
      //     orderId,
      //     marketMakingPairId,
      //     baseWithdrawalTxId: baseWithdrawalResult[0]?.request_id,
      //     quoteWithdrawalTxId: quoteWithdrawalResult[0]?.request_id,
      //   },
      //   {
      //     jobId: `monitor_withdrawal_${orderId}`,
      //     attempts: 3,
      //     removeOnComplete: false,
      //   },
      // );

      // this.logger.log(`Queued withdrawal monitoring for order ${orderId}`);

      this.logger.warn(
        `Withdrawal disabled for validation. Refunding order ${orderId} instead of sending to exchange.`,
      );

      await this.refundPaymentState(
        orderId,
        paymentState,
        'validation mode: withdrawal disabled',
      );

      await this.userOrdersService.updateMarketMakingOrderState(
        orderId,
        'failed',
      );
    } catch (error) {
      this.logger.error(
        `Error withdrawing for order ${orderId}: ${error.message}`,
        error.stack,
      );
      await this.userOrdersService.updateMarketMakingOrderState(
        orderId,
        'failed',
      );
      throw error;
    }
  }

  /**
   * Step 4: Join Campaign
   * Called after withdrawal is confirmed on exchange
   * 
   * This handler:
   * 1. Joins the HuFi campaign (external Web3 integration) if campaign details provided
   * 2. Stores local record for tracking and future reward distribution
   */
  @Process('join_campaign')
  async handleJoinCampaign(job: Job<{
    orderId: string;
    campaignId?: string;
    hufiCampaign?: {
      chainId: number;
      campaignAddress: string;
    };
  }>) {
    const { orderId, campaignId, hufiCampaign } = job.data;
    this.logger.log(`Joining campaign for order ${orderId}`);

    try {
      await this.userOrdersService.updateMarketMakingOrderState(
        orderId,
        'joining_campaign',
      );

      const order = await this.userOrdersService.findMarketMakingByOrderId(orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }

      // Step 1: Try to join HuFi campaign (external Web3 integration)
      let hufiJoinResult = null;
      if (hufiCampaign?.chainId && hufiCampaign?.campaignAddress) {
        try {
          this.logger.log(
            `Joining HuFi campaign: chainId=${hufiCampaign.chainId}, address=${hufiCampaign.campaignAddress}`,
          );

          // Get active campaigns to find matching one
          const campaigns = await this.hufiCampaignService.getCampaigns();
          const matchingCampaign = campaigns.find(
            (c) =>
              c.chainId === hufiCampaign.chainId &&
              c.address.toLowerCase() === hufiCampaign.campaignAddress.toLowerCase(),
          );

          if (matchingCampaign) {
            // Use the @Cron auto-join logic from CampaignService
            // The cron job handles Web3 auth and joining
            this.logger.log(
              `Found matching HuFi campaign: ${matchingCampaign.address}. Will be auto-joined by cron.`,
            );
            hufiJoinResult = { scheduled: true, campaign: matchingCampaign };
          } else {
            this.logger.warn(
              `HuFi campaign not found: chainId=${hufiCampaign.chainId}, address=${hufiCampaign.campaignAddress}`,
            );
          }
        } catch (hufiError) {
          // HuFi join failure should not block the MM order flow
          this.logger.error(
            `Failed to join HuFi campaign (non-blocking): ${hufiError.message}`,
          );
        }
      }

      // Step 2: Store local campaign record for tracking and reward distribution
      const localCampaignId = campaignId || `mm_${order.exchangeName}_${order.pair}`;
      const participation = await this.localCampaignService.joinCampaign(
        order.userId,
        localCampaignId,
        orderId,
      );

      this.logger.log(
        `Local campaign record created for order ${orderId}: participationId=${participation.id}`,
      );

      if (hufiJoinResult) {
        this.logger.log(
          `HuFi campaign join scheduled for order ${orderId}`,
        );
      }

      await this.userOrdersService.updateMarketMakingOrderState(
        orderId,
        'campaign_joined',
      );

      // Queue market making start
      await (job.queue as any).add(
        'start_mm',
        {
          userId: order.userId,
          orderId,
        },
        {
          jobId: `start_mm_${orderId}`,
          attempts: 3,
          removeOnComplete: false,
        },
      );

      this.logger.log(`Queued market making start for order ${orderId}`);
    } catch (error) {
      this.logger.error(
        `Error joining campaign for ${orderId}: ${error.message}`,
        error.stack,
      );
      await this.userOrdersService.updateMarketMakingOrderState(
        orderId,
        'failed',
      );
      throw error;
    }
  }

  // ============================================================================
  // Existing job handlers (start_mm, stop_mm, execute_mm_cycle)
  // ============================================================================

  @Process('start_mm')
  async handleStartMM(job: Job<{ userId: string; orderId: string }>) {
    const { userId, orderId } = job.data;
    this.logger.log(`Starting MM for user ${userId}, order ${orderId}`);

    const order = await this.userOrdersService.findMarketMakingByOrderId(
      orderId,
    );
    if (!order) {
      this.logger.error(`MM Order ${orderId} not found`);
      return;
    }

    const key = createStrategyKey({
      user_id: userId,
      client_id: orderId,
      type: 'pureMarketMaking',
    });

    await this.userOrdersService.updateMarketMakingOrderState(
      orderId,
      'running',
    );

    // Add first execution cycle job
    await (job.queue as any).add('execute_mm_cycle', {
      userId,
      orderId,
      strategyParams: {
        ...order,
        pair: order.pair.replaceAll('-ERC20', ''),
        clientId: orderId,
        bidSpread: Number(order.bidSpread),
        askSpread: Number(order.askSpread),
        orderAmount: Number(order.orderAmount),
        orderRefreshTime: Number(order.orderRefreshTime),
        numberOfLayers: Number(order.numberOfLayers),
        amountChangePerLayer: Number(order.amountChangePerLayer),
        ceilingPrice: Number(order.ceilingPrice),
        floorPrice: Number(order.floorPrice),
      },
    });
  }

  @Process('stop_mm')
  async handleStopMM(job: Job<{ userId: string; orderId: string }>) {
    const { userId, orderId } = job.data;
    this.logger.log(`Stopping MM for user ${userId}, order ${orderId}`);

    await this.strategyService.stopStrategyForUser(
      userId,
      orderId,
      'pureMarketMaking',
    );
    await this.userOrdersService.updateMarketMakingOrderState(
      orderId,
      'stopped',
    );
  }

  @Process('execute_mm_cycle')
  async handleExecuteMMCycle(
    job: Job<{ userId: string; orderId: string; strategyParams: any }>,
  ) {
    const { userId, orderId, strategyParams } = job.data;

    // 1. Check if order is still running
    const order = await this.userOrdersService.findMarketMakingByOrderId(
      orderId,
    );
    if (!order || order.state !== 'running') {
      this.logger.log(
        `MM Order ${orderId} is not running (state: ${order?.state}), stopping cycle.`,
      );
      return;
    }

    // 2. Execute one cycle of MM
    try {
      await this.strategyService.executeMMCycle(strategyParams);
    } catch (error) {
      this.logger.error(
        `Error executing MM cycle for ${orderId}: ${error.message}`,
      );
    }

    // 3. Re-queue
    await (job.queue as any).add('execute_mm_cycle', job.data, {
      delay: strategyParams.orderRefreshTime || 10000, // Default 10s
    });
  }

  /**
   * Monitor market making withdrawal confirmations
   * This handler checks both base and quote withdrawal confirmations
   * and proceeds to join_campaign once both are confirmed
   */
  @Process('monitor_mm_withdrawal')
  async handleMonitorMMWithdrawal(job: Job<{
    orderId: string;
    marketMakingPairId: string;
    baseWithdrawalTxId?: string;
    quoteWithdrawalTxId?: string;
  }>) {
    const { orderId, baseWithdrawalTxId, quoteWithdrawalTxId } = job.data;
    const startTime = Date.now();
    const retryCount = job.attemptsMade || 0;

    this.logger.log(
      `Monitoring MM withdrawals for order ${orderId} (attempt ${retryCount + 1})`,
    );

    try {
      // Check base withdrawal confirmation
      const baseConfirmed = baseWithdrawalTxId
        ? await this.checkWithdrawalConfirmation(baseWithdrawalTxId)
        : false;

      // Check quote withdrawal confirmation
      const quoteConfirmed = quoteWithdrawalTxId
        ? await this.checkWithdrawalConfirmation(quoteWithdrawalTxId)
        : false;

      this.logger.log(
        `Order ${orderId} withdrawal status - Base: ${baseConfirmed ? 'confirmed' : 'pending'}, Quote: ${quoteConfirmed ? 'confirmed' : 'pending'}`,
      );

      // Check for timeout
      const elapsed = Date.now() - startTime;
      if (elapsed > this.WITHDRAWAL_TIMEOUT_MS) {
        this.logger.error(
          `Withdrawal confirmation timeout for order ${orderId} after ${elapsed}ms`,
        );
        // Mark order as failed due to timeout
        await this.userOrdersService.updateMarketMakingOrderState(
          orderId,
          'failed',
        );
        return;
      }

      // If both confirmed, proceed to join campaign
      if (baseConfirmed && quoteConfirmed) {
        this.logger.log(
          `Both withdrawals confirmed for order ${orderId}, proceeding to join campaign`,
        );
        await (job.queue as any).add(
          'join_campaign',
          { orderId },
          {
            jobId: `join_campaign_${orderId}`,
            removeOnComplete: false,
          },
        );
        this.logger.log(`Queued join_campaign for order ${orderId}`);
        return;
      }

      // Not confirmed yet, retry after delay
      this.logger.log(
        `Withdrawals not fully confirmed for order ${orderId}, retrying in ${this.RETRY_DELAY_MS}ms`,
      );
      await job.queue.add('monitor_mm_withdrawal', job.data, {
        jobId: `monitor_withdrawal_${orderId}`,
        delay: this.RETRY_DELAY_MS,
        attempts: retryCount + 1,
      });
    } catch (error) {
      this.logger.error(
        `Error monitoring MM withdrawal for order ${orderId}: ${error.message}`,
        error.stack,
      );

      // Retry if not exceeded max attempts
      const maxAttempts = 60; // 60 retries * 30s = 30 minutes max
      if (retryCount < maxAttempts) {
        this.logger.log(
          `Retrying withdrawal monitoring for order ${orderId} (${retryCount + 1}/${maxAttempts})`,
        );
        await job.queue.add('monitor_mm_withdrawal', job.data, {
          jobId: `monitor_withdrawal_${orderId}`,
          delay: this.RETRY_DELAY_MS,
          attempts: retryCount + 1,
        });
      } else {
        this.logger.error(
          `Max retries exceeded for order ${orderId}, marking as failed`,
        );
        await this.userOrdersService.updateMarketMakingOrderState(
          orderId,
          'failed',
        );
      }
    }
  }

  /**
   * Check if a withdrawal is confirmed by checking the Mixin snapshot
   */
  private async checkWithdrawalConfirmation(
    txId: string,
  ): Promise<boolean> {
    try {
      const snapshot =
        await this.mixinClientService.client.safe.fetchSafeSnapshot(txId);

      if (!snapshot) {
        this.logger.warn(`Snapshot ${txId} not found`);
        return false;
      }

      // Consider confirmed if we have at least 1 confirmation and a transaction hash
      const confirmed =
        snapshot.confirmations >= 1 && !!snapshot.transaction_hash;

      if (confirmed) {
        this.logger.log(
          `Withdrawal ${txId} confirmed (confirmations: ${snapshot.confirmations}, hash: ${snapshot.transaction_hash})`,
        );
      }

      return confirmed;
    } catch (error) {
      this.logger.error(
        `Error checking withdrawal ${txId}: ${error.message}`,
      );
      return false;
    }
  }
}
