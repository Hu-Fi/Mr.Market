import { SafeSnapshot } from '@mixin.dev/mixin-node-sdk';

export type MixinReleaseToken = {
  orderId: string; // UUID
  userId: string; // User UUID
  assetId: string; // Asset UUID
  state: string; // state of release token
  amount: string; // amount of token
  createdAt: string; // timestamp
  updatedAt: string; // timestamp
};

export type MixinReleaseHistory = {
  orderId: string; // UUID
  snapshot: SafeSnapshot; // Mixin snapshot
  createdAt: string; // timestamp
  fee: string; // Fee made
};
