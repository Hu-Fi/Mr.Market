export const TARDING_TYPE_MAP: Record<string, string> = {
  SP: 'Spot',
  SW: 'Swap',
  MM: 'Market Making',
  AR: 'Arbitrage',
  LE: 'Leverage',
  PE: 'Perpetual',
};

export const SPOT_ORDER_TYPE_MAP: Record<string, string> = {
  LB: 'Limit Buy',
  LS: 'Limit Sell',
  MB: 'Market Buy',
  MS: 'Market Sell',
};

export const SPOT_EXCHANGE_MAP: Record<string, string> = {
  '01': 'binance',
  '02': 'bitfinex',
  '03': 'mexc',
  '04': 'okx',
  '05': 'gate',
  '06': 'lbank',
};

// Decode memo for payment related actions, delete is auth protected
export const ARBITRAGE_MEMO_ACTION_MAP: Record<string, string> = {
  CR: 'create',
  DE: 'deposit',
  WI: 'withdraw',
};

// Decode memo for payment related actions, delete is auth protected
export const MARKET_MAKING_MEMO_ACTION_MAP: Record<string, string> = {
  CR: 'create',
  DE: 'deposit',
  WI: 'withdraw',
};
