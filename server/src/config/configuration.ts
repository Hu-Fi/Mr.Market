export default () => ({
  dev: process.env.NODE_ENV !== 'production',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '3000',
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    ssl: process.env.POSTGRES_SSL === 'true',
    user: process.env.POSTGRES_USER,
    pass: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DATABASE,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  apiKeys: {
    binance: [
      {
        key: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_SECRET,
      },
    ],
    mexc: [
      {
        key: process.env.MEXC_API_KEY,
        secret: process.env.MEXC_SECRET,
      },
    ],
    bitfinex: [
      {
        key: process.env.BITFINEX_API_KEY,
        secret: process.env.BITFINEX_SECRET,
      },
    ],
  },
  admin: {
    pass: process.env.ADMIN_PASSWORD,
    jwt_secret: process.env.JWT_SECRET,
    encryption_private_key: process.env.ENCRYPTION_PRIVATE_KEY,
  },
  mixin: {
    app_id: process.env.MIXIN_APP_ID,
    session_id: process.env.MIXIN_SESSION_ID,
    server_public_key: process.env.MIXIN_SERVER_PUBLIC_KEY,
    session_private_key: process.env.MIXIN_SESSION_PRIVATE_KEY,
    spend_private_key: process.env.MIXIN_SPEND_PRIVATE_KEY,
    oauth_secret: process.env.MIXIN_OAUTH_SECRET,
  },
  coingecko: {
    api_key: process.env.COINGECKO_API_KEY,
  },
  rebalance: {
    run: process.env.RUN_REBALANCE || 'false',
    bigone_api_key: process.env.WITHDRAWAL_BIGONE_API_KEY,
    bigone_api_secret: process.env.WITHDRAWAL_BIGONE_API_SECRET,
  },
  strategy: {
    run: process.env.RUN_STARTEGY_FOR_MIXIN_ORDERS || 'false',
    mixin_snapshots_run: process.env.RUN_MIXIN_SNAPSHOTS || 'false',
  },
  constants: {
    mixin_api_base_url:
      process.env.MIXIN_API_BASE_URL || 'https://api.mixin.one',
  },
  web3: {
    network: {
      mainnet: {
        rpc_url: process.env.WEB3_MAINNET_RPC_URL,
      },
      sepolia: {
        rpc_url: process.env.WEB3_SEPOLIA_RPC_URL,
      },
      polygon: {
        rpc_url: process.env.WEB3_POLYGON_RPC_URL,
      },
      polygon_amoy: {
        rpc_url: process.env.WEB3_POLYGON_AMOY_RPC_URL,
      },
      bsc: {
        rpc_url: process.env.WEB3_BSC_MAINNET_RPC_URL,
      },
      bsc_testnet: {
        rpc_url: process.env.WEB3_BSC_TESTNET_RPC_URL,
      },
    },
    private_key: process.env.WEB3_PRIVATE_KEY,
    gas_multiplier: +process.env.WEB3_GAS_MULTIPLIER || 1,
  },
  hufi: {
    campaign_launcher: {
      api_url: process.env.HUFI_CAMPAIGN_LAUNCHER_API_URL || 'https://cl.hu.finance',
    },
    recording_oracle: {
      api_url: process.env.HUFI_RECORDING_ORACLE_API_URL || 'https://ro.hu.finance',
    },
  },
});
