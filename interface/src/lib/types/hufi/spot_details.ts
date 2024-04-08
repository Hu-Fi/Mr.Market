// server/src/common/types/orders/details.ts
export type SpotOrderDetails = {
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

  amount: string;
  price: string;
  avg: string;
  filled: string;
  pay: string;
  fee: string;
  receive: string;
};
