export default () => ({
  dev: process.env.IS_DEV || true,
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    ssl: process.env.POSTGRES_SSL,
    user: process.env.POSTGRES_USER,
    pass: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DATABASE,
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
  },
  mixin: {
    app_id: process.env.MIXIN_APP_ID,
    session_id: process.env.MIXIN_SESSION_ID,
    server_public_key: process.env.MIXIN_SERVER_PUBLIC_KEY,
    session_private_key: process.env.MIXIN_SESSION_PRIVATE_KEY,
    spend_private_key: process.env.MIXIN_SPEND_PRIVATE_KEY,
  },
  coingecko: {
    api_key: process.env.COINGECKO_API_KEY,
  },
  rebalance: {
    bigone_api_key: process.env.WITHDRAWAL_BIGONE_API_KEY,
    bigone_api_secret: process.env.WITHDRAWAL_BIGONE_API_SECRET,
  },
  constants: {
    mixin_api_base_url:
      process.env.MIXIN_API_BASE_URL || 'https://api.mixin.one',
  },
  strategy: {
    run: process.env.RUN_STARTEGY_FOR_MIXIN_ORDERS || false,
  },
});
