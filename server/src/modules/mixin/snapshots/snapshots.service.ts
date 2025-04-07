import { randomUUID } from 'crypto';
import BigNumber from 'bignumber.js';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  MixinApi,
  SafeSnapshot,
  KeystoreClientReturnType,
  buildSafeTransactionRecipient,
  Keystore,
  getTotalBalanceFromOutputs,
  getUnspentOutputsForRecipients,
  buildSafeTransaction,
  encodeSafeTransaction,
  signSafeTransaction,
  blake3Hash,
  MixinCashier,
  SequencerTransactionRequest,
  SafeMixinRecipient,
  SafeWithdrawalRecipient,
} from '@mixin.dev/mixin-node-sdk';
import { CustomLogger } from 'src/modules/logger/logger.service';
import { SnapshotsRepository } from 'src/modules/mixin/snapshots/snapshots.repository';
import { SymbolAssetIdMapValue } from 'src/common/types/pairs/pairs';
import {
  memoPreDecode,
  decodeArbitrageCreateMemo,
  decodeMarketMakingCreateMemo,
  decodeSimplyGrowCreateMemo,
  decodeSpotLimitOrderMemo,
  decodeSpotMarketOrderMemo,
} from 'src/common/helpers/mixin/memo';
import { MessageService } from 'src/modules/mixin/message/message.service';
import { Snapshot } from 'src/common/entities/snapshots.entity';
@Injectable()
export class SnapshotsService {
  private events: EventEmitter2;
  private keystore: Keystore;
  private spendKey: string;
  private client: KeystoreClientReturnType;
  private readonly logger = new CustomLogger(SnapshotsService.name);
  private readonly enableCron: boolean;

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private snapshotsRepository: SnapshotsRepository,
    private messageService: MessageService,
  ) {
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
    this.spendKey = this.configService.get<string>('mixin.spend_private_key');
    this.client = MixinApi({
      keystore: this.keystore,
    });
    this.events = this.eventEmitter;

    this.enableCron =
      this.configService.get<string>('strategy.mixin_snapshots_run') === 'true';
    this.logger.debug(
      `${SnapshotsService.name} enableCron: ${this.enableCron}`,
    );
  }

  async mapSymbolAndNetworkToAssetId(symbol: string, network: string) {
    // Make a json map to store the symbol and network to asset id
    // Find a way to automate this from mixin top assets api
    return symbol + network;
  }

  async getDepositFee(asset_id: string) {
    this.logger.log(`getDepositFee() asset_id: ${asset_id}`);
    return 0;
  }

  async getDepositAddress(asset_id: string) {
    const asset = await this.client.network.fetchAsset(asset_id);
    // @ts-expect-error sdk type error
    const dust = asset.dust;
    const confirmations = asset.confirmations;
    const chain_id = asset.chain_id;

    const entities = await this.client.safe.depositEntries({
      members: [this.keystore.app_id],
      threshold: 1,
      chain_id,
    });

    this.logger.debug(`getDepositAddress() chain_id: ${chain_id}`);
    this.logger.debug(
      `getDepositAddress() entities: ${JSON.stringify(entities)}`,
    );

    const primaryEntity = entities.map((entity) => {
      if (entity.is_primary) {
        return {
          address: entity.destination,
          memo: entity.tag,
          minimum_deposit_amount: dust,
          confirmations,
        };
      }
    });

    if (primaryEntity) {
      return primaryEntity[0];
    } else {
      this.logger.warn(
        `No primary deposit entry found for asset_id: ${asset_id}`,
      );
      return null;
    }
  }

  async withdrawal(
    asset_id: string,
    destination: string,
    memo: string,
    amount: string,
  ) {
    const asset = await this.client.network.fetchAsset(asset_id);
    const chain =
      asset.chain_id === asset.asset_id
        ? asset
        : await this.client.network.fetchAsset(asset.chain_id);
    const fee = chain;
    this.logger.log(`Withdrawal Fee: ${fee.amount} ${fee.symbol}`);

    // withdrawal with chain asset as fee
    if (fee.asset_id !== asset.asset_id) {
      const outputs = await this.client.utxo.safeOutputs({
        asset: asset_id,
        state: 'unspent',
      });
      const feeOutputs = await this.client.utxo.safeOutputs({
        asset: fee.asset_id,
        state: 'unspent',
      });

      const recipients: (SafeWithdrawalRecipient | SafeMixinRecipient)[] = [
        {
          amount: amount,
          destination: destination,
        },
      ];
      const { utxos, change } = getUnspentOutputsForRecipients(
        outputs,
        recipients,
      );
      if (!change.isZero() && !change.isNegative()) {
        recipients.push(
          buildSafeTransactionRecipient(
            outputs[0].receivers,
            outputs[0].receivers_threshold,
            change.toString(),
          ),
        );
      }
      // the index of ghost keys must be the same with the index of outputs
      // but withdrawal output doesnt need ghost key, so index + 1
      const ghosts = await this.client.utxo.ghostKey(
        recipients
          .filter((r) => 'members' in r)
          .map((r, i) => ({
            hint: randomUUID(),
            receivers: (r as SafeMixinRecipient).members,
            index: i + 1,
          })),
      );
      const tx = buildSafeTransaction(
        utxos,
        recipients,
        [undefined, ...ghosts],
        memo,
      );
      const raw = encodeSafeTransaction(tx);
      const ref = blake3Hash(Buffer.from(raw, 'hex')).toString('hex');

      const feeRecipients = [
        // fee output
        buildSafeTransactionRecipient([MixinCashier], 1, fee.amount),
      ];
      const { utxos: feeUtxos, change: feeChange } =
        getUnspentOutputsForRecipients(feeOutputs, feeRecipients);
      if (!feeChange.isZero() && !feeChange.isNegative()) {
        // add fee change output if needed
        feeRecipients.push(
          buildSafeTransactionRecipient(
            feeOutputs[0].receivers,
            feeOutputs[0].receivers_threshold,
            feeChange.toString(),
          ),
        );
      }
      const feeGhosts = await this.client.utxo.ghostKey(
        feeRecipients.map((r, i) => ({
          hint: randomUUID(),
          // @ts-expect-error type
          receivers: r.members,
          index: i,
        })),
      );
      const feeTx = buildSafeTransaction(
        feeUtxos,
        feeRecipients,
        feeGhosts,
        'withdrawal-fee-memo',
        [ref],
      );
      const feeRaw = encodeSafeTransaction(feeTx);

      const txId = randomUUID();
      const feeId = randomUUID();
      const txs = await this.client.utxo.verifyTransaction([
        {
          raw,
          request_id: txId,
        },
        {
          raw: feeRaw,
          request_id: feeId,
        },
      ]);

      const signedRaw = signSafeTransaction(tx, txs[0].views, this.spendKey);
      const signedFeeRaw = signSafeTransaction(
        feeTx,
        txs[1].views,
        this.spendKey,
      );
      const res = await this.client.utxo.sendTransactions([
        {
          raw: signedRaw,
          request_id: txId,
        },
        {
          raw: signedFeeRaw,
          request_id: feeId,
        },
      ]);
      this.logger.log(`Withdrawal result: ${JSON.stringify(res)}`);
      return res;
    }
    // withdrawal with asset as fee
    else {
      const outputs = await this.client.utxo.safeOutputs({
        asset: asset_id,
        state: 'unspent',
      });

      const recipients = [
        // withdrawal output, must be put first
        {
          amount: amount,
          destination: destination,
        },
        // fee output
        buildSafeTransactionRecipient([MixinCashier], 1, fee.amount),
      ];
      const { utxos, change } = getUnspentOutputsForRecipients(
        outputs,
        recipients,
      );
      if (!change.isZero() && !change.isNegative()) {
        // add change output if needed
        recipients.push(
          buildSafeTransactionRecipient(
            outputs[0].receivers,
            outputs[0].receivers_threshold,
            change.toString(),
          ),
        );
      }
      // the index of ghost keys must be the same with the index of outputs
      // but withdrawal output doesnt need ghost key, so index + 1
      const ghosts = await this.client.utxo.ghostKey(
        recipients
          .filter((r) => 'members' in r)
          .map((r, i) => ({
            hint: randomUUID(),
            receivers: (r as SafeMixinRecipient).members,
            index: i + 1,
          })),
      );
      // spare the 0 inedx for withdrawal output, withdrawal output doesnt need ghost key
      const tx = buildSafeTransaction(
        utxos,
        recipients,
        [undefined, ...ghosts],
        'withdrawal-memo',
      );
      const raw = encodeSafeTransaction(tx);

      const request_id = randomUUID();
      const txs = await this.client.utxo.verifyTransaction([
        {
          raw,
          request_id,
        },
      ]);

      const signedRaw = signSafeTransaction(tx, txs[0].views, this.spendKey);
      const res = await this.client.utxo.sendTransactions([
        {
          raw: signedRaw,
          request_id,
        },
      ]);
      this.logger.log(`Withdrawal result: ${JSON.stringify(res)}`);
      return res;
    }
  }

  async getWithdrawalInfo(asset_id: string, destination: string) {
    const fee = await this.getWithdrawalFee(asset_id, destination);
    const asset = await this.client.safe.fetchAsset(asset_id);
    const chain =
      asset.chain_id === asset.asset_id
        ? asset
        : await this.client.safe.fetchAsset(asset.chain_id);
    const balance = await this.getAssetBalance(asset_id);
    return {
      asset,
      chain,
      destination,
      fee,
      balance,
    };
  }

  async getWithdrawalFee(asset_id: string, destination: string) {
    return await this.client.safe.fetchFee(asset_id, destination);
  }

  async sendMixinTx(
    opponent_id: string,
    asset_id: string,
    amount: string,
  ): Promise<SequencerTransactionRequest[]> {
    const recipients = [
      buildSafeTransactionRecipient([opponent_id], 1, amount),
    ];
    const outputs = await this.client.utxo.safeOutputs({
      members: [this.keystore.app_id],
      threshold: 1,
      asset: asset_id,
      state: 'unspent',
    });

    const balance = getTotalBalanceFromOutputs(outputs);
    const amountBN = BigNumber(amount);
    if (balance.isLessThan(amountBN)) {
      this.logger.error(`Insufficient fund`);
      return;
    }

    const { utxos, change } = getUnspentOutputsForRecipients(
      outputs,
      recipients,
    );
    if (!change.isZero() && !change.isNegative()) {
      recipients.push(
        buildSafeTransactionRecipient(
          outputs[0].receivers,
          outputs[0].receivers_threshold,
          change.toString(),
        ),
      );
    }
    const ghosts = await this.client.utxo.ghostKey(
      recipients.map((r, i) => ({
        hint: randomUUID(),
        receivers: r[0].members,
        index: i,
      })),
    );
    const tx = buildSafeTransaction(utxos, recipients, ghosts, 'Refund');
    const raw = encodeSafeTransaction(tx);

    const request_id = randomUUID();
    const verifiedTx = await this.client.utxo.verifyTransaction([
      {
        raw,
        request_id,
      },
    ]);

    const signedRaw = signSafeTransaction(
      tx,
      verifiedTx[0].views,
      this.keystore.session_private_key,
    );

    const sendedTx = await this.client.utxo.sendTransactions([
      {
        raw: signedRaw,
        request_id,
      },
    ]);
    return sendedTx;
  }

  async refund(snapshot: Snapshot, message: string = '') {
    try {
      await this.sendMixinTx(
        snapshot.opponent_id,
        snapshot.asset_id,
        snapshot.amount,
      );
      if (!message) {
        return;
      }
      this.messageService.sendTextMessage(snapshot.opponent_id, message);
    } catch (error) {
      this.logger.error(`Failed to refund snapshot: ${error.message}`);
    }
  }

  async getAllAssetBalances(type: 'map' | 'list') {
    try {
      // Fetch all outputs
      const outputs = await this.client.utxo.safeOutputs({});

      // Group outputs by asset ID
      const groupedByAssetId = outputs.reduce((acc, output) => {
        const assetId = output.asset_id;
        if (!acc[assetId]) {
          acc[assetId] = [];
        }
        acc[assetId].push(output);
        return acc;
      }, {});

      // Calculate total balance for each asset and map to symbols
      if (type === 'map') {
        const result = {};
        for (const [assetId, outputs] of Object.entries(groupedByAssetId)) {
          // @ts-expect-error types
          const totalBalance = getTotalBalanceFromOutputs(outputs);
          const asset = await this.client.network.fetchAsset(assetId);
          const symbol = asset.symbol;
          if (symbol) {
            result[symbol] = totalBalance.toString();
          } else {
            this.logger.warn(`Symbol not found for asset ID: ${assetId}`);
          }
        }
        return result;
      } else {
        const result = [];
        for (const [assetId, outputs] of Object.entries(groupedByAssetId)) {
          // @ts-expect-error types
          const totalBalance = getTotalBalanceFromOutputs(outputs);
          const asset = await this.client.network.fetchAsset(assetId);
          const symbol = asset.symbol;
          result.push({
            asset_id: assetId,
            balance: totalBalance.toString(),
            symbol,
          });
        }
        return result;
      }
    } catch (error) {
      this.logger.error(`Error fetching asset balances: ${error.message}`);
      throw error;
    }
  }

  async getAllAssetBalancesCCXT() {
    try {
      const symbolBalances = await this.getAllAssetBalances('map');

      const formattedBalances = {
        balance: {
          free: symbolBalances,
          total: symbolBalances,
          used: {},
        },
        exchange: 'mixin',
        key_id: 0,
        name: 'Mixin',
      };

      return formattedBalances;
    } catch (error) {
      this.logger.error(`Error formatting balances to CCXT: ${error.message}`);
      throw error;
    }
  }

  async getAsset(asset_id: string) {
    return await this.client.network.fetchAsset(asset_id);
  }

  async getAssetBalance(asset_id: string): Promise<string> {
    try {
      return await this.client.utxo.safeAssetBalance({ asset: asset_id });
    } catch (e) {
      this.logger.error(`Mixin getAssetBalance() => ${e.message}`);
      return '0';
    }
  }

  async checkMixinBalanceEnough(
    asset_id: SymbolAssetIdMapValue,
    amount: string,
  ): Promise<boolean> {
    try {
      const balance = await this.getAssetBalance(asset_id);
      if (BigNumber(balance).isLessThan(amount)) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async createSnapshot(snapshot: SafeSnapshot) {
    try {
      return await this.snapshotsRepository.createSnapshot(snapshot);
    } catch (e) {
      this.logger.error(`createSnapshot()=> ${e}`);
    }
  }

  async fetchAndProcessSnapshots() {
    try {
      const snapshots = await this.client.safe.fetchSafeSnapshots({});
      if (!snapshots) {
        this.logger.error(`fetchAndProcessSnapshots()=> No snapshots`);
        return;
      }
      snapshots.forEach(async (snapshot: SafeSnapshot) => {
        await this.handleSnapshot(snapshot);
      });
      return snapshots;
    } catch (error) {
      this.logger.error(`Failed to fetch snapshots: ${error}`);
    }
  }

  private async handleSnapshot(snapshot: SafeSnapshot) {
    const exist = await this.snapshotsRepository.checkSnapshotExist(
      snapshot.snapshot_id,
    );
    if (exist) {
      return;
    }
    if (!snapshot.memo) {
      await this.createSnapshot(snapshot);
      this.logger.warn('snapshot no memo, return');
      return;
    }
    if (snapshot.memo.length === 0) {
      await this.createSnapshot(snapshot);
      this.logger.warn('snapshot.memo.length === 0, return');
      // await this.refund(snapshot);
      return;
    }
    try {
      const exist = await this.snapshotsRepository.checkSnapshotExist(
        snapshot.snapshot_id,
      );

      // Snapshot already being processed
      if (exist) {
        return;
      }

      // Snapshot has no memo, store and refund
      if (!snapshot.memo || snapshot.memo.length === 0) {
        return;
      }

      this.logger.log(`handleSnapshot()=> snapshot.memo: ${snapshot.memo}`);
      // Hex and Base58 decode memo, verify checksum, refund if invalid
      const hexDecodedMemo = Buffer.from(snapshot.memo, 'hex').toString(
        'utf-8',
      );
      const { payload, version, tradingTypeKey, actionKey } =
        memoPreDecode(hexDecodedMemo);
      if (!payload) {
        this.logger.log(
          `Snapshot memo is invalid, store and refund: ${snapshot.snapshot_id}`,
        );
        return;
      }

      // Only memo version 1 is supported
      if (version !== 1) {
        this.logger.log(
          `Snapshot memo version is not 1, store and refund: ${snapshot.snapshot_id}`,
        );
        return;
      }

      switch (tradingTypeKey) {
        // Spot trading
        case 0:
          if (actionKey === 1) {
            const spotDetails = decodeSpotLimitOrderMemo(payload);
            if (!spotDetails) {
              break;
            }
            this.events.emit(
              'spot_trading.create_limit_order',
              spotDetails,
              snapshot,
            );
          } else if (actionKey === 2) {
            const spotDetails = decodeSpotMarketOrderMemo(payload);
            if (!spotDetails) {
              break;
            }
            this.events.emit(
              'spot_trading.create_market_order',
              spotDetails,
              snapshot,
            );
          }
          break;
        // Swap
        case 1:
          break;
        // Simply grow
        case 2:
          const simplyGrowDetails = decodeSimplyGrowCreateMemo(payload);
          if (!simplyGrowDetails) {
            break;
          }
          this.events.emit('simply_grow.create', simplyGrowDetails, snapshot);
          break;
        // Market making
        case 3:
          const mmDetails = decodeMarketMakingCreateMemo(payload);
          if (!mmDetails) {
            break;
          }
          this.events.emit('market_making.create', mmDetails, snapshot);
          break;
        // Arbitrage
        case 4:
          const arbDetails = decodeArbitrageCreateMemo(payload);
          if (!arbDetails) {
            break;
          }
          this.events.emit('arbitrage.create', arbDetails, snapshot);
          break;
        // Refund
        default:
          break;
      }
    } catch (error) {
      this.logger.error(`handleSnapshot()=> ${error}`);
    } finally {
      await this.createSnapshot(snapshot);
    }
  }

  @Cron('*/5 * * * * *') // Every 5 seconds
  async handleSnapshots(): Promise<void> {
    // Check if the cron is enabled
    if (this.enableCron) {
      await this.fetchAndProcessSnapshots();
    } else {
      return;
    }
  }

  async getSnapshotById(snapshotId: string): Promise<Snapshot | null> {
    try {
      const snapshot = await this.snapshotsRepository.findSnapshotByID(
        snapshotId,
      );
      return snapshot ? snapshot : null;
    } catch (error) {
      this.logger.error(`Error fetching snapshot by ID: ${error.message}`);
      return null;
    }
  }

  async sendOrderCompletionMessage(
    userId: string,
    orderId: string,
    orderType: string,
    side: string,
    amount: string,
    symbol: string,
    price: string,
  ): Promise<void> {
    try {
      // Format a user-friendly message
      const action = side === 'buy' ? 'bought' : 'sold';
      const orderTypeText = orderType === 'limit' ? 'limit' : 'market';

      const message =
        `✅ Your ${orderTypeText} order has been completed!\n\n` +
        `Order ID: ${orderId}\n` +
        `You ${action} ${amount} ${symbol} at ${price}\n\n` +
        `Thank you for using our service!`;

      // Send the message to the user
      await this.messageService.sendTextMessage(userId, message);

      this.logger.log(
        `Sent order completion message to user ${userId} for order ${orderId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send order completion message: ${error.message}`,
        error.stack,
      );
    }
  }
}
