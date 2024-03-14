import { type SequencerTransactionRequest } from '@mixin.dev/mixin-node-sdk';

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
  transaction: SequencerTransactionRequest; // Mixin snapshot ID
  createdAt: string; // timestamp
  fee: string; // Fee made
};
