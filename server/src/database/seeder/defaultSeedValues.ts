import {
  GrowdataArbitragePair,
  GrowdataExchange,
  GrowdataMarketMakingPair,
  GrowdataSimplyGrowToken,
} from 'src/common/entities/grow-data.entity';

export const defaultExchanges: GrowdataExchange[] = [
  { exchange_id: 'okx', name: 'OKX', enable: true },
  { exchange_id: 'mexc', name: 'MEXC', enable: false },
  { exchange_id: 'bigone', name: 'BigONE', enable: false },
  { exchange_id: 'kraken', name: 'Kraken', enable: false },
  { exchange_id: 'binance', name: 'Binance', enable: false },
  { exchange_id: 'bitget', name: 'Bitget', enable: false },
  { exchange_id: 'bybit', name: 'Bybit', enable: false },
];

export const defaultMarketMakingPairs: GrowdataMarketMakingPair[] = [
  {
    id: '7fef38d5-5644-42e9-9abb-9f8e1a51ff36',
    exchange_id: 'okx',
    symbol: 'BTC/USDT',
    base_symbol: 'BTC',
    target_symbol: 'USDT',
    base_asset_id: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
    base_icon_url:
      'https://mixin-images.zeromesh.net/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128',
    target_asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    target_icon_url:
      'https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128',
    base_price: '',
    target_price: '',
    enable: true,
  },
  {
    id: 'ce5d8591-4ed0-4286-a390-c4ba254e442a',
    exchange_id: 'okx',
    symbol: 'ETH/USDT',
    base_symbol: 'ETH',
    target_symbol: 'USDT',
    base_asset_id: '43d61dcd-e413-450d-80b8-101d5e903357',
    base_icon_url:
      'https://mixin-images.zeromesh.net/zVDjOxNTQvVsA8h2B4ZVxuHoCF3DJszufYKWpd9duXUSbSapoZadC7_13cnWBqg0EmwmRcKGbJaUpA8wFfpgZA=s128',
    target_asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    target_icon_url:
      'https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128',
    base_price: '',
    target_price: '',
    enable: true,
  },
  {
    id: '8c60b47e-e77c-4068-962f-e542c9919af4',
    exchange_id: 'mexc',
    symbol: 'HMT/USDT',
    base_symbol: 'HMT',
    target_symbol: 'USDT',
    base_asset_id: '30e340a7-3284-3f04-8594-fbdd8f2da79f',
    base_icon_url:
      'https://mixin-images.zeromesh.net/rXVPsR7G8pZsAuWB2-UUDd1q8Ok4amyZwkBaRJt9qFDHruTnYKR0tffYoDwzz4-nHwnsKRyy26wRJaVXc5_kOj6eP3JKlgJYVCGMJg=s128',
    target_asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    target_icon_url:
      'https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128',
    base_price: '',
    target_price: '',
    enable: true,
  },
  {
    id: '460dc888-ed7e-451c-acf2-44099065faf4',
    exchange_id: 'mexc',
    symbol: 'XIN/USDT',
    base_symbol: 'XIN',
    target_symbol: 'USDT',
    base_asset_id: 'c94ac88f-4671-3976-b60a-09064f1811e8',
    base_icon_url:
      'https://mixin-images.zeromesh.net/UasWtBZO0TZyLTLCFQjvE_UYekjC7eHCuT_9_52ZpzmCC-X-NPioVegng7Hfx0XmIUavZgz5UL-HIgPCBECc-Ws=s128',
    target_asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    target_icon_url:
      'https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128',
    base_price: '',
    target_price: '',
    enable: true,
  },
];

export const defaultArbitragePairs: GrowdataArbitragePair[] = [
  {
    id: '7fef38d5-5644-42e9-9abb-9f8e1a51ff36',
    symbol: 'BTC/USDT',
    base_symbol: 'BTC',
    target_symbol: 'USDT',
    base_asset_id: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
    base_icon_url:
      'https://mixin-images.zeromesh.net/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128',
    target_asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    target_icon_url:
      'https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128',
    base_price: '',
    target_price: '',
    base_exchange_id: 'okx',
    target_exchange_id: 'lbank',
    enable: true,
  },
  {
    id: '9684ecfa-198a-4074-8add-3a38ceafe0d6',
    symbol: 'ETH/USDT',
    base_symbol: 'ETH',
    target_symbol: 'USDT',
    base_asset_id: '43d61dcd-e413-450d-80b8-101d5e903357',
    base_icon_url:
      'https://mixin-images.zeromesh.net/zVDjOxNTQvVsA8h2B4ZVxuHoCF3DJszufYKWpd9duXUSbSapoZadC7_13cnWBqg0EmwmRcKGbJaUpA8wFfpgZA=s128',
    target_asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    target_icon_url:
      'https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128',
    base_price: '',
    target_price: '',
    base_exchange_id: 'okx',
    target_exchange_id: 'lbank',
    enable: true,
  },
  {
    id: '4e1d4a23-3218-4f3a-b6e2-c59f42e64b70',
    symbol: 'HMT/USDT',
    base_symbol: 'HMT',
    target_symbol: 'USDT',
    base_asset_id: '30e340a7-3284-3f04-8594-fbdd8f2da79f',
    base_icon_url:
      'https://mixin-images.zeromesh.net/rXVPsR7G8pZsAuWB2-UUDd1q8Ok4amyZwkBaRJt9qFDHruTnYKR0tffYoDwzz4-nHwnsKRyy26wRJaVXc5_kOj6eP3JKlgJYVCGMJg=s128',
    target_asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    target_icon_url:
      'https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128',
    base_price: '',
    target_price: '',
    base_exchange_id: 'okx',
    target_exchange_id: 'lbank',
    enable: true,
  },
  {
    id: '4e1d4a23-3218-4f3a-b6e2-c59f42e64b70',
    symbol: 'XIN/USDT',
    base_symbol: 'XIN',
    target_symbol: 'USDT',
    base_asset_id: '43d61dcd-e413-450d-80b8-101d5e903357',
    base_icon_url:
      'https://mixin-images.zeromesh.net/UasWtBZO0TZyLTLCFQjvE_UYekjC7eHCuT_9_52ZpzmCC-X-NPioVegng7Hfx0XmIUavZgz5UL-HIgPCBECc-Ws=s128',
    target_asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    target_icon_url:
      'https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128',
    base_price: '',
    target_price: '',
    base_exchange_id: 'okx',
    target_exchange_id: 'lbank',
    enable: true,
  },
];

export const defaultSimplyGrowTokens: GrowdataSimplyGrowToken[] = [
  {
    asset_id: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon_url:
      'https://mixin-images.zeromesh.net/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128',
    apy: '',
    enable: true,
  },
  {
    asset_id: '43d61dcd-e413-450d-80b8-101d5e903357',
    name: 'Ethereum',
    symbol: 'ETH',
    icon_url:
      'https://mixin-images.zeromesh.net/zVDjOxNTQvVsA8h2B4ZVxuHoCF3DJszufYKWpd9duXUSbSapoZadC7_13cnWBqg0EmwmRcKGbJaUpA8wFfpgZA=s128',
    apy: '',
    enable: true,
  },
  {
    asset_id: '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
    name: 'USDT@ERC20',
    symbol: 'USDT@ERC20',
    icon_url:
      'https://mixin-images.zeromesh.net/ndNBEpObYs7450U08oAOMnSEPzN66SL8Mh-f2pPWBDeWaKbXTPUIdrZph7yj8Z93Rl8uZ16m7Qjz-E-9JFKSsJ-F=s128',
    apy: '',
    enable: true,
  },
  {
    asset_id: '9b180ab6-6abe-3dc0-a13f-04169eb34bfa',
    name: 'USDC@ERC20',
    symbol: 'USDC@ERC20',
    icon_url:
      'https://mixin-images.zeromesh.net/w3Lb-pMrgcmmrzamf7FG_0c6Dkh3w_NRbysqzpuacwdVhMYSOtnX2zedWqiSG7JuZ3jd4xfhAJduQXY1rPidmywn=s128',
    apy: '',
    enable: true,
  },
  {
    asset_id: '30e340a7-3284-3f04-8594-fbdd8f2da79f',
    name: 'Human',
    symbol: 'HMT',
    icon_url:
      'https://mixin-images.zeromesh.net/rXVPsR7G8pZsAuWB2-UUDd1q8Ok4amyZwkBaRJt9qFDHruTnYKR0tffYoDwzz4-nHwnsKRyy26wRJaVXc5_kOj6eP3JKlgJYVCGMJg=s128',
    apy: '',
    enable: true,
  },
  {
    asset_id: 'c94ac88f-4671-3976-b60a-09064f1811e8',
    name: 'Mixin',
    symbol: 'XIN',
    icon_url:
      'https://mixin-images.zeromesh.net/UasWtBZO0TZyLTLCFQjvE_UYekjC7eHCuT_9_52ZpzmCC-X-NPioVegng7Hfx0XmIUavZgz5UL-HIgPCBECc-Ws=s128',
    apy: '',
    enable: true,
  },
];
