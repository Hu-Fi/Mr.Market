import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({
  path: process.env.NODE_ENV
    ? `.env.${process.env.NODE_ENV as string}`
    : '.env',
});

// Ensure data directory exists
const dbPath = process.env.DATABASE_PATH || 'data/mr_market.db';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export default new DataSource({
  type: 'sqlite',
  database: dbPath,
  entities: ['dist/src/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: ['dist/src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true,
  // Enable WAL for better concurrency
  extra: {
    flags: ['-WAL'],
  },
});