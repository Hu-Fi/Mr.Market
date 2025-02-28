export const TARDING_TYPE_MAP: Record<string, string> = {
  0: 'Spot',
  1: 'Swap',
  2: 'Simply Grow',
  3: 'Market Making',
  4: 'Arbitrage',
  5: 'Leverage',
  6: 'Perpetual',
};

export const SPOT_ORDER_TYPE_MAP: Record<string, string> = {
  1: 'limit',
  2: 'market',
};

export const SPOT_ACTION_TYPE_MAP: Record<string, string> = {
  1: 'buy',
  2: 'sell',
};

export const ARBITRAGE_MEMO_ACTION_MAP: Record<string, string> = {
  1: 'create',
  2: 'deposit',
};

export const MARKET_MAKING_MEMO_ACTION_MAP: Record<string, string> = {
  1: 'create',
  2: 'deposit',
};

export const SIMPLY_GROW_MEMO_ACTION_MAP: Record<string, string> = {
  1: 'create',
  2: 'deposit',
};
