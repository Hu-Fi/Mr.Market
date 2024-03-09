export type SpotOrderStatus =
  | 'created'
  | 'placed'
  | 'partial_filled' // Limit order only
  | 'filled'
  | 'mixin_released'
  | 'success';
