export const TARDING_TYPE_MAP: Record<string, string> = {
  0: 'Spot',
  1: 'Market Making',
  2: 'Simply Grow',
};

export const SPOT_ORDER_TYPE_MAP: Record<string, string> = {
  0: 'Limit Buy',
  1: 'Limit Sell',
  2: 'Market Buy',
  3: 'Market Sell',
};

export const SPOT_EXCHANGE_MAP: Record<string, string> = {
  1: 'binance',
  2: 'bitfinex',
  3: 'mexc',
  4: 'okx',
  5: 'gate',
  6: 'lbank',
  11: 'bitget',
  12: 'bigone',
  13: 'fswap',
};

export const MARKET_MAKING_MEMO_ACTION_MAP: Record<string, string> = {
  1: 'create',
  2: 'deposit',
};

export const SIMPLY_GROW_MEMO_ACTION_MAP: Record<string, string> = {
  1: 'create',
  2: 'deposit',
};
