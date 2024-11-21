export interface Exchange {
  exchange_id: string;
  name: string;
  enable: boolean;
}

export interface SimplyGrowToken {
  asset_id: string;
  name: string;
  symbol: string;
  icon_url: string;
  apy?: string;
  enable: boolean;
}

export interface SimplyGrowTokenDto extends SimplyGrowToken {}

export interface ArbitragePair {
  id: string;
  symbol: string;
  base_symbol: string;
  target_symbol: string;
  base_asset_id: string;
  base_icon_url: string;
  target_asset_id: string;
  target_icon_url: string;
  base_price?: string;
  target_price?: string;
  base_exchange_id: string;
  target_exchange_id: string;
  enable: boolean;
}
  
export interface ArbitragePairDto extends ArbitragePair {}

export interface MarketMakingPair {
  id: string;
  symbol: string;
  base_symbol: string;
  target_symbol: string;
  base_asset_id: string;
  base_icon_url: string;
  target_asset_id: string;
  target_icon_url: string;
  base_price?: string;
  target_price?: string;
  exchange_id: string;
  enable: boolean;
}

export interface MarketMakingPairDto extends MarketMakingPair {}

export interface GrowInfo {
  exchanges: Exchange[];
  simply_grow: {
    tokens: SimplyGrowToken[];
  };
  arbitrage: {
    pairs: ArbitragePair[];
  };
  market_making: {
    pairs: MarketMakingPair[];
  };
}
