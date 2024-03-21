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
};
