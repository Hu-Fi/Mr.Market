import { env } from "$env/dynamic/public";
import type { SupportedExchanges, SupportedPairs, SupportedTimeFrame } from "$lib/types/hufi/exchanges"

export const AppName = "Mr.market"
export const AppURL = env.PUBLIC_APP_URL || "https://mr-market-one.vercel.app"

export const SHOW_BAR = env.PUBLIC_SHOW_BAR || true
export const BOT_ID = env.PUBLIC_BOT_ID || '73179ddc-3e29-485b-bb13-03f514d4318e'
export const OAUTH_SCOPE = env.PUBLIC_OAUTH_SCOPE || 'PROFILE:READ ASSETS:READ SNAPSHOTS:READ'
export const MIXIN_MESSENGER_INSTALL = env.PUBLIC_MIXIN_MESSENGER_INSTALL || 'https://messenger.mixin.one/install'
export const MIXIN_API_BASE_URL = env.PUBLIC_MIXIN_API_BASE_URL || 'https://api.mixin.one'

export const HUFI_SOCKET_URL = env.PUBLIC_HUFI_SOCKET_URL || '//mrmarket-production.up.railway.app'
export const HUFI_BACKEND_URL = env.PUBLIC_HUFI_BACKEND_URL || 'https://mrmarket-production.up.railway.app'
export const HUMAN_PROTOCOL_GROUP_URL = env.PUBLIC_HUMAN_PROTOCOL_GROUP_URL || 'https://mixin.one/apps/5a33fc52-f445-4170-a06a-47f8be94a8f3'

export const ORDER_STATE_FETCH_INTERVAL = 3000
export const ORDER_STATE_TIMEOUT_DURATION = 180000

// It must sync with server/pairs.ts
export const PAIRS_MAP = {
  Z7GC: 'BTC/USDT-ERC20',
  MX5C: 'ETH/USDT-ERC20',
  K8TT: 'BNB/USDT-ERC20',
  Y3YH: 'XRP/USDT-ERC20',
  W4EF: 'ADA/USDT-ERC20',
  GTYF: 'SOL/USDT-ERC20',
  K5M2: 'DOT/USDT-ERC20',
  DHWY: 'DOGE/USDT-ERC20',
  L4JL: 'AVAX/USDT-ERC20',
  RSMN: 'SHIB/USDT-ERC20',
  LM4O: 'LTC/USDT-ERC20',
  HM3F: 'UNI/USDT-ERC20',
  POGO: 'LINK/USDT-ERC20',
  XDWG: 'MATIC/USDT-ERC20',
  FQ10: 'ALGO/USDT-ERC20',
  M5TG: 'TRX/USDT-ERC20',
  XE6B: 'XLM/USDT-ERC20',
  LHSF: 'VET/USDT-ERC20',
  JUP0: 'ICP/USDT-ERC20',
  AYWT: 'FIL/USDT-ERC20',
  Y5IL: 'THETA/USDT-ERC20',
  X2P1: 'XTZ/USDT-ERC20',
  ABWR: 'EOS/USDT-ERC20',
  PXYT: 'AAVE/USDT-ERC20',
  X1YO: 'KSM/USDT-ERC20',
  EHE7: 'NEO/USDT-ERC20',
  YJGX: 'MKR/USDT-ERC20',
  MQQZ: 'CRO/USDT-ERC20',
  WOX4: 'ATOM/USDT-ERC20',
  BVSE: 'COMP/USDT-ERC20',
  FNZB: 'HMT/USDT-ERC20',
};
export const PAIRS_MAP_REVERSED: { [key: string]: string } = Object.entries(
  PAIRS_MAP,
).reduce((acc, [key, value]) => ({ ...acc, [value]: key }), {});


// It must sync with server/pairs.ts
export const SYMBOL_ASSET_ID_MAP = {
  BOX: 'f5ef6b5d-cc5a-3d90-b2c0-a2fd386e7a3c',
  BTC: 'c6d0c728-2624-429b-8e0d-d9d19b6592fa',
  ETH: '67b6b3b5-78ce-33c2-b7e2-9e5b24f19b29',
  XIN: '9437ebfa-873a-3032-8295-eedb8a3c86c7',
  'USDT-ERC20': '4d8c508b-91c5-375b-92b0-ee702ed2dac5',
  DOGE: '6770a1e5-6086-44d5-b60f-545f9d9e8ffd',
  UNI: 'a31e847e-ca87-3162-b4d1-322bc552e831',
  pUSD: '31d2ea9c-95eb-3355-b65b-ba096853bc18',
  EOS: '6cfe566e-4aad-470b-8c9a-2fd35b49c68d',
  eETH: 'f51ced0d-c99f-3efd-9e17-7c8e7efc2dab',
  'USDT-TRC20': 'b91e18ff-a9ae-3dc7-8679-e935d9a4b34b',
  DOT: '54c61a72-b982-4034-a556-0d99e3c21e39',
  HMT: '235d8ced-3d41-3c2f-8368-7dba52cb9868',
  WOO: 'b829139c-cdb2-362c-a46d-57c66dce4fcc',
  MOB: 'eea900a8-b327-488c-8d8d-1428702fe240',
  SOL: '64692c23-8971-4cf4-84a7-4dd1271dd887',
  SSV: 'f86f0e2e-6dff-3da8-a8b5-386b3fcf2337',
  SHIB: 'dcde18b9-f015-326f-b8b1-5b820a060e44',
  USDC: 'fe26b981-29e9-3032-a0e9-b24d619e987e',
  AR: '882eb041-64ea-465f-a4da-817bd3020f52',
  LTC: '76c802a2-7c88-447f-a93e-c29c9e5dd9c8',
  FIL: '08285081-e1d8-4be6-9edc-e203afa932da',
  CKB: 'd243386e-6d84-42e6-be03-175be17bf275',
  SC: '990c4c29-57e9-48f6-9819-7d986ea44985',
  ONE: '257c225a-0777-3292-bf00-eee3738e7f6d',
  LINK: 'f6f1c01c-8489-3346-b127-dc0dc09b9ce7',
  MANA: 'c3dc19ae-d087-3279-ac51-dc655940256a',
  BCH: 'fd11b6e3-0b87-41f1-a41f-f0e9b49e5bf0',
  XRP: '23dfb5a5-5d7b-48b6-905f-3970e3176e27',
  BNB: '1949e683-6a08-49e2-b087-d6b72398588f',
  MATIC: 'b7938396-3f94-4e0a-9179-d3440718156f',
  ZEC: 'c996abc9-d94e-4494-b1cf-2a3fd3ac5714',
  TRX: '25dabac5-056a-48ff-b9f9-f67395dc407c',
  AVAX: 'cbc77539-0a20-4666-8c8a-4ded62b36f0a',
  AKT: '9c612618-ca59-4583-af34-be9482f5002d',
  WBTC: '83c8bfca-78ee-3845-9e6c-e3d69e7b381c',
  XMR: '05c5ac01-31f9-4a69-aa8a-ab796de1d041',
  ATOM: '7397e9f1-4e42-4dc8-8a3b-171daaadd436',
  XLM: '56e63c06-b506-4ec5-885a-4a5ac17b83c1',
  ZEN: 'a2c5d22b-62a2-4c13-b3f0-013290dbac60',
  '3056.HK': '5c392265-1e05-3520-a25b-2fe9e36510d7',
  'USDT-MATIC': '218bc6f4-7927-3f8e-8568-3a3725b74361',
  NEAR: 'd6ac94f7-c932-4e11-97dd-617867f0669e',
  IQ: '336d5d97-329c-330d-8e62-2b7c9ba40ea0',
  'USDT-BNB': '94213408-4ee7-3150-a9c4-9c5cce421c78',
  VGX: 'b1375fc0-b5a5-3d62-b06d-567f8dc3c905',
  DYDX: 'fd86e3bc-faeb-3f62-ad09-b59d2ebcc59c',
  PEOPLE: '1886815e-7dbe-3f43-9602-bb54ea46b254',
  ETC: '2204c1ee-0ea2-4add-bb9a-b3719cfff93a',
  ALGO: '706b6f84-3333-4e55-8e89-275e71ce9803',
  eUSD: '659c407a-0489-30bf-9e6f-84ef25c971c9',
  BTT: '47b13785-25e2-3c5c-ac6b-3713e9c31c22',
  BSV: '574388fd-b93f-4034-a682-01c2bc095d17',
  'USDT-BTC': '815b0b1a-2764-3736-8faa-42d694fa620a',
  DAI: '8549b4ad-917c-3461-a646-481adc5d7f7f',
  ENS: 'e9521558-81e1-30ec-9a07-9746f397ff69',
  AKITA: 'aa189c4c-99ca-39eb-8d96-71a8f6f7218a',
  RNDR: 'd49a63be-a027-3668-a4ab-97f6d3378215',
  AAVE: 'b80af5fd-85b8-3f00-b7c2-68d2c9f1137a',
  HNS: '13036886-6b83-4ced-8d44-9f69151587bf',
  NMC: 'f8b77dc0-46fd-4ea1-9821-587342475869',
  WETH: 'e68e3448-6293-37a1-9943-fc927e65fed7',
  LRC: 'ca0bf3ff-7cd0-3f59-8613-d463ee7fef9f',
  XAUt: '8e8d677c-e9f1-3201-b1b3-4e46193df4f1',
  HT: 'bced5614-2fdc-3463-a680-0b3e3b32ce2e',
  GRT: '88b29aef-6059-3351-abbd-0ecfcc574280',
  mAED: 'b5289c48-ec3a-3cdb-b2c4-0913d1812cd5',
  FTM: '089e8f32-59a7-3fee-bdb8-ff81646a8874',
  XEM: '27921032-f73e-434e-955f-43d55672ee31',
  EURT: '2f5bef0e-d41a-3cf3-b6fa-b8dd0d8a3327',
  DASH: '6472e7e3-75fd-48b6-b1dc-28d294ee1476',
  AXS: '714c5cd7-0ff5-3b6e-99ae-24eec4e72b47',
  SAND: '6ec8a3bc-bd9f-3489-b973-eacadb214c99',
  'FTX Token': '0c79a53f-9caf-3e7c-a3ce-1edcba33301f',
  APT: 'd2c1c7e1-a1a9-4f88-b282-d93b0a08b42b',
  XTZ: '5649ca42-eb5f-4c0e-ae28-d9a4e77eded3',
  RVN: '6877d485-6b64-4225-8d7e-7333393cb243',
  LPT: 'd5e8dc9c-7271-31f9-8d98-aaa785e4b54e',
  SUSHI: '4488ed2a-bfad-3036-9401-0ee9593aa5ff',
  BUSD: 'cfcd55cd-9f76-3941-81d6-9e7616cc1b83',
  NFT: '9c7376bd-8202-340c-a582-7a3db718faf4',
  APE: 'f960726c-903e-3053-aea1-9f0e205c028a',
  GALA: 'f89aa4b6-19b8-38ec-9693-ccfd11123fcf',
  CRV: '4a47d208-ce92-3f24-8a10-541fa17b7620',
  MKR: 'efdbb270-b484-38e3-8ecc-31440af1b605',
  KSM: '9d29e4f6-d67c-4c4b-9525-604b04afbe9f',
  ZRX: 'de713a5c-1695-36f2-a5c4-ced654d46aba',
  SNT: 'dd093fd7-5698-340f-a8f6-25e9a24150f6',
  '1INCH': '9bddb338-cc05-3181-a288-c75afe783b72',
  SLP: 'fd806345-087d-3d2e-8376-3e561cab0442',
  BAT: '38aea7d9-6554-3216-bbc5-02f7e369eb55',
  DCR: '8f5caf2a-283d-4c85-832a-91e83bbf290b',
  'USDT-EOS': '5dac5e28-ad13-31ea-869f-41770dfcee09',
  JASMY: '93b52562-300a-3edb-b510-f68e54aa422c',
  CHZ: '008b2927-df56-3743-9825-369cfb2f04ce',
  TON: 'ef660437-d915-4e27-ad3f-632bfb6ba0ee',
  GAL: '12f22adb-71b9-37a9-9324-8a04e30479c6',
  TUSD: '4a2419ff-8f50-3eda-ace6-90a297610cbf',
  BTS: '05891083-63d2-4f3d-bfbe-d14d7fb9b25a',
  LDO: 'f73493f1-79ad-3a95-bf78-a73ca6d0a065',
  KISHU: 'b489c7fe-2ae2-3536-b3c1-7b26c8057ba9',
  RARE: 'a99c9946-463e-3365-829d-866e4c4a7d81',
  AUDIO: 'b3a713dc-8592-31a1-9b0b-5331441dc37a',
  STORJ: '598d950a-5ab9-3066-911c-b99a89ac0b05',
  YFI: '0119f16d-f44c-3c12-9d59-044f5303c028',
  LEO: 'ceeaa170-b2fe-3bc1-91a5-5ffa468a1f33',
  COCOS: 'be998122-ebca-3e7b-a046-a2c67f30b535',
  CRO: '35460057-16ff-3f61-a438-d98be98a30ad',
  C98: '842de01a-da69-3c42-a241-34c89b35dc60',
  USDP: '7b937d0c-1591-3d6f-81a5-81dc85aa4b38',
  PAX: 'f74b91d4-a701-3ed0-8238-f67249398bea',
  WOM: '5b52fe36-4bbf-3d1a-8089-8b736a05ef89',
  IOST: 'ddfd8ffd-bb7d-39a2-ad4d-1a806048b2f2',
  INJ: 'fd7d7c85-5bb6-3671-97ba-5b902bec15a9',
  BZZ: '3bf5312f-df56-3340-b8ae-0058f0b500f9',
  FDUSD: '5cbf9966-9094-376d-afd6-dea70df2548a',
  RLY: 'bb4c9a0c-245b-3bd2-a3f4-a5eb73c90c00',
  ECZZ: '2b010131-b085-3edc-890d-0816499209d4',
  GNT: '67a2517b-5b97-3cf5-872a-4e3cdf5af130',
  SAITO: '58f18254-8087-3501-b0da-a6a9c15ea808',
  EDEN: '491afde7-b406-3236-8f86-9f6979b6621f',
  OKB: 'f753c3ff-48a6-3e12-98d0-78f3ced58f3f',
  ANKR: '5570b726-cc17-3dca-8395-5c2a20db9c03',
  BTM: '71a0e8b5-a289-4845-b661-2b70ff9968aa',
  ALICE: 'e5bc7050-2464-3780-a1cf-ca4e81744e53',
  TEL: '4f22af7b-d356-3994-bd42-18f19826e56a',
  BLUR: '211b5530-326e-39ab-89d6-f23c3fe2a08a',
  GRIN: '1351e6bd-66cf-40c1-8105-8a8fe518a222',
  OXT: '03d307d0-2fe4-391e-a936-01f298ffa700',
  OGN: 'd1cde9f9-93e1-3afc-ad2d-8207fdc8b7f5',
  MX: 'a46f92f3-0919-3e61-8ebd-192ee0229f93',
  ACH: 'a0f6b5ab-a5d9-321a-b2f6-60256111757c',
  WIN: 'af9e453d-5803-3e52-bc25-f5a1dd0319b7',
  BTO: '66087a43-31da-3098-8cb4-775117343ba0',
  CVX: 'c896cef1-3e8d-3074-a289-8d1712f5203a',
  XDC: 'b12bb04a-1cea-401c-a086-0be61f544889',
  OCT: 'c21b7bd8-65c5-3ca7-979d-c6b33e2b85a0',
  ELON: '943c3932-eb9e-35e9-914d-c068118d75af',
  ELF: '8bb37ff7-3a66-3953-8c43-5d5d00b977c4',
  PAXG: 'e5b854b9-3bca-31d0-802e-7e5d149d3787',
  AMP: '6fdcb3a5-8c2c-37f8-97d9-0495dd4178eb',
  GTC: 'a4661ef2-2004-3d5c-97c8-7feec6579832',
  ENJ: '8ec5e494-9f49-33fa-9fd4-b40bf38ab2b7',
  SKL: 'cba6e401-e9d3-31b9-bb8d-c9f6eacbca68',
  OMG: 'd8fe578b-1112-31b0-8de5-f7b32e31d08d',
  CGO: 'a3b84192-d319-3719-9d43-31fabbbccee7',
  AE: 'ee9da648-fd1a-3090-a8e1-6a3f2c4e528a',
  GT: '5665f8a8-cec0-3f40-bf10-73d0c1ca4e5f',
  MASK: 'c1ad6341-dcf5-3d1a-b0db-23e88b27f00b',
  FLOW: '28dec3d0-f9e8-3243-82ec-e69b21d68a88',
  VEN: '325edb50-7588-3953-af0f-faebc87d02fc',
  NPXS: '32ccb399-83cc-3663-b67c-175059dd94a0',
  EOSDAC: 'c15d7ac6-c126-3006-b87f-a20a7c4aa636',
  IOTX: '405db54d-a4c7-36da-8597-544e63be464d',
  STC: 'c99a3779-93df-404d-945d-eddc440aa0b2',
  JST: '37d5cdee-267a-326e-848e-14ccde547729',
  NAS: '4c28a7b3-9cc7-3528-8355-9929db52bd07',
  PAY: '8f0b39cc-4c8d-3284-b71e-93a406d2ea4c',
  RLC: '1aa542f8-904e-31da-9f40-ddf08d1a3391',
  KNC: '0704051f-704b-31c0-a020-1c8defc95b03',
  RUFF: 'a2f675d8-108c-34a0-9503-a2d4fec591ba',
  BAND: '82a50cdb-eb61-3e97-8cc0-a441f0825992',
  CVC: '16fefe30-e19d-3229-a432-5d0fdb0abd4f',
  BIT: '960a8e5f-8aea-3a16-a61b-5aada82e1360',
  SRM: '6772570d-3066-307b-b879-d650e664a228',
  LOOM: 'f2c1b79e-a3f2-31ae-ab89-901d92023a8b',
  SRX: '34570682-2156-3812-bddb-7f2881f041ec',
  GTO: '292b4153-d5b7-3716-a0ad-fa1ac41be7d8',
  DODO: '8862c66a-e39f-3776-b195-2897b98d1853',
  NULS: '4473b321-826c-3a88-b922-92d248021c6f',
  NU: '17dd0dc2-7467-35ee-a45b-2467de1893c9',
  REP: 'b9a1944b-764b-31cd-b3a3-dd7bac14b92c',
  BICO: '892efd85-0e5b-3c3c-b029-fbf423bc50ce',
  OCN: '478ce398-4a00-3274-900e-02ae4516c08f',
};

// It must sync with server/pairs.ts
export const SUPPORTED_PAIRS: {
  [k in SupportedExchanges]: SupportedPairs[]
} = {
  okx: [
    'BTC/USDT',
    'ETH/USDT',
    'BNB/USDT',
    'UNI/USDT',
    'CRV/USDT',
    'SOL/USDT',
    'SUI/USDT',
  ],
  bitfinex: ['BTC/USDT', 'ETH/USDT', 'HMT/USDT'],
  mexc: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'UNI/USDT', 'HMT/USDT'],
  gate: ['HMT/USDT'],
  lbank: ['HMT/USDT'],
}
export const SUPPORTED_UNIQUE_PAIRS: string[] = Array.from(new Set(Object.values(SUPPORTED_PAIRS).flatMap(pairs => pairs)));
export const SUPPORTED_EXCHANGES = Object.keys(SUPPORTED_PAIRS);
export const SUPPORTED_TIMERANGES: SupportedTimeFrame[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M']
export const SUPPORTED_ARBITRAGE_PAIRS = [
  {symbol: "BTC/USDT", exchange: "okx",},
  {symbol: "ETH/USDT", exchange: "okx",},
  {symbol: "SOL/USDT", exchange: "okx",},
  {symbol: "ADA/USDT", exchange: "okx",},
  {symbol: "XRP/USDT", exchange: "okx",},
  {symbol: "HMT/USDT", exchange: "gate",},
  {symbol: "ETH/USDT", exchange: "gate",},
  {symbol: "HMT/USDT", exchange: "mexc",},
  {symbol: "HMT/USDT", exchange: "bitfinex",},
  {symbol: "HMT/USDT", exchange: "lbank",}
];
export const SUPPORTED_MARKET_MAKING_PAIRS = [
  {symbol: "BTC/USDT", exchange: "okx",},
  {symbol: "ETH/USDT", exchange: "okx",},
  {symbol: "SOL/USDT", exchange: "okx",},
  {symbol: "ADA/USDT", exchange: "okx",},
  {symbol: "XRP/USDT", exchange: "okx",},
  {symbol: "HMT/USDT", exchange: "gate",},
  {symbol: "ETH/USDT", exchange: "gate",},
  {symbol: "HMT/USDT", exchange: "mexc",},
  {symbol: "HMT/USDT", exchange: "bitfinex",},
  {symbol: "HMT/USDT", exchange: "lbank",}
];

export const SUPPORTED_UNIQUE_ARBITRAGE_PAIRS = Array.from(new Set(SUPPORTED_ARBITRAGE_PAIRS.map(pair => pair.symbol)));

// Limit needs 12, Market needs 10, use 14 to avoid data loss
export const ORDERBOOK_STREAM_LENGTH = 14
export const LIMIT_ORDERBOOK_LENGTH = 12
export const MARKET_ORDERBOOK_LENGTH = 10
export const LIMIT_ORDERBOOK_HALF_LENGTH = LIMIT_ORDERBOOK_LENGTH / 2
export const MARKET_ORDERBOOK_HALF_LENGTH = MARKET_ORDERBOOK_LENGTH / 2

export const BTC_UUID = 'c6d0c728-2624-429b-8e0d-d9d19b6592fa'

export const UpColorBg = "bg-green-500"
export const UpColorText = "text-green-600"
export const DownColorBg = "bg-red-500"
export const DownColorText = "text-red-600"
export const FocusUpColorBg = "focus:bg-green-500"
export const FocusDownColorBg = "focus:bg-red-500"

export const CoinsTypeTabs = [
  // {
  //   name: "favorites",
  //   id: "favorites",
  // },
  {
    name:  "all",
    id: "all",
  },
  {
    name:  "layer1",
    id: "layer-1",
  },
  {
    name:  "layer2",
    id: "layer-2",
  },
  {
    name: "inscriptions",
    id: "inscriptions",
  },
  {
    name: "ai",
    id: "artificial-intelligence",
  },
  {
    name: "meme",
    id: "ai-meme-coins",
  },
  {
    name: "defi",
    id: "decentralized-finance-defi",
  },
  {
    name: "game_fi",
    id: "gaming",
  },
  {
    name: "nft",
    id: "non-fungible-tokens-nft",
  }
]

export const maskOption = {
  numeral: true,
  numeralDecimalMark: '.',
  numeralPositiveOnly: true,
  numeralDecimalScale: 8,
  numeralThousandsGroupStyle: 'none'
}
