// server/src/common/entities/spot-order.entity.ts
export type SpotOrder = {
  orderId: string;
  snapshotId: string;
  userId: string;
  exchangeName: string;
  type: string;
  state: string;
  symbol: string;
  baseAssetId: string;
  targetAssetId: string;
  apiKeyId?: string;
  createdAt: string;
  updatedAt: string;
};

export type SpotInfo = {
  trading_pairs: SpotTradingPair[];
  exchanges: string[];
  fee: {
    spot: string;
  };
}

export type SpotTradingPair = {
  id: string;
  ccxt_id: string;
  symbol: string;
  exchange_id: string;
  amount_significant_figures: string;
  price_significant_figures: string;
  buy_decimal_digits: string;
  sell_decimal_digits: string;
  max_buy_amount: string;
  max_sell_amount: string;
  base_asset_id: string;
  quote_asset_id: string;
  enable: boolean;
}

export enum SpotOrderState {
  CREATED = 'created',
  PARTIALLY_FILLED = 'partially_filled',
  FILLED = 'filled',
  CANCELED = 'canceled',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  FAILED = 'failed',
  COMPLETED = 'completed'
}