export interface AssetBalances {
  [assetId: string]: string; // Asset ID to Balance map
}

interface Balance {
  free: Record<string, string>;
  used: Record<string, string>;
  total: Record<string, string>;
}

export interface APIKeyBalance {
  key_id: string | number;
  exchange: string;
  name: string;
  balance: Balance;
}

export interface AggregatedBalances {
  [exchange: string]: {
    free: Record<string, string>;
    used: Record<string, string>;
    total: Record<string, string>;
  };
}
