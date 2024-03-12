export const ERROR_MAP: Record<string, string> = {
  '1000': 'created',
  '9001': 'place_failed',
  '90011': 'exchange_balance_not_enough',
  '90012': 'mixin_balance_not_enough',
  '1001': 'placed',
  '1002': 'partial_filled_limit_only',
  '1003': 'filled',
  '9002': 'mixin_release_failed',
  '1004': 'mixin_released',
  '1005': 'success',
};

export type SpotOrderStatus = keyof typeof ERROR_MAP;
