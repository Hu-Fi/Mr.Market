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
  },
});
