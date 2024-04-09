// Define the original state codes with values converted to uppercase
// Map code to text
export const STATE_CODE_MAP: Record<string, string> = {
  '10001': 'ORDER_CREATED',
  '90001': 'EXCHANGE_BALANCE_NOT_ENOUGH',
  '90002': 'MIXIN_BALANCE_NOT_ENOUGH',
  '10011': 'EXCHANGE_ORDER_PLACED',
  '90011': 'EXCHANGE_DOESNT_SUPPORT_FETCH_ORDER',
  '10021': 'EXCHANGE_ORDER_PARTIAL_FILLED',
  '10031': 'EXCHANGE_ORDER_FILLED',
  '90021': 'EXCHANGE_ORDER_CANCELED',
  '10041': 'MIXIN_RELEASE_INIT',
  '90041': 'MIXIN_RELEASE_FAILED',
  '10042': 'MIXIN_RELEASED',
  '10051': 'ORDER_SUCCESS',
};

// Map text to code
export const STATE_TEXT_MAP: {
  [K in keyof typeof STATE_CODE_MAP as Uppercase<
    (typeof STATE_CODE_MAP)[K]
  >]: K;
} = Object.entries(STATE_CODE_MAP).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [value.toUpperCase()]: key,
  }),
  {} as {
    [K in keyof typeof STATE_CODE_MAP as Uppercase<
      (typeof STATE_CODE_MAP)[K]
    >]: K;
  },
);
export type SpotOrderStatus = keyof typeof STATE_CODE_MAP;

// created: both asset received, order created
// paused: order paused
// deleted: soft delete
// refunded: soft deleted and refunded
export type ArbitrageStates = 'created' | 'paused' | 'deleted' | 'refunded';
export type MarketMakingStates = 'created' | 'paused' | 'deleted' | 'refunded';
