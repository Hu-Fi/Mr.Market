export interface MixinAsset {
  asset_id: string;
  chain_id: string;
  fee_asset_id: string;
  symbol: string;
  name: string;
  icon_url: string;
  price_btc: string;
  change_btc: string;
  price_usd: string;
  change_usd: string;
  asset_key: string;
}

export interface SwapAsset extends MixinAsset {
  
}