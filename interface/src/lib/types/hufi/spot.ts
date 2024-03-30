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