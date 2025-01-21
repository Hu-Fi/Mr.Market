// This file is used to seed the database with initial data
// Make sure to run this file after the database and the table is created (after migration:run)

import * as dotenv from 'dotenv';
import { DataSource, Repository } from 'typeorm';
import {
  GrowdataMarketMakingPair,
  GrowdataArbitragePair,
  GrowdataSimplyGrowToken,
} from '../../common/entities/grow-data.entity';
import {
  defaultArbitragePairs,
  defaultMarketMakingPairs,
  defaultSimplyGrowTokens,
  defaultSpotdataTradingPairs,
} from './defaultSeedValues';
import { SpotdataTradingPair } from '../../common/entities/spot-data.entity';
import { appendFileSync } from 'fs';
import { randomBytes } from 'crypto';

async function connectToDatabase() {
  dotenv.config();
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    entities: [
      GrowdataMarketMakingPair,
      GrowdataArbitragePair,
      GrowdataSimplyGrowToken,
      SpotdataTradingPair,
    ],
    synchronize: false,
    ssl: process.env.POSTGRES_SSL === 'true',
  });

  try {
    await dataSource.initialize();
    console.log('Connected to the database successfully!');
    return dataSource;
  } catch (error) {
    console.error('Error connecting to the database', error);
    throw error;
  }
}

async function seedSpotdataTradingPair(
  repository: Repository<SpotdataTradingPair>,
) {
  for (const pair of defaultSpotdataTradingPairs) {
    const exists = await repository.findOneBy({ id: pair.id });
    if (!exists) {
      await repository.save(pair);
    }
  }
  console.log('Seeding SpotdataTradingPair complete!');
}

async function seedGrowdataMarketMakingPair(
  repository: Repository<GrowdataMarketMakingPair>,
) {
  for (const pair of defaultMarketMakingPairs) {
    const exists = await repository.findOneBy({ id: pair.id });
    if (!exists) {
      await repository.save(pair);
    }
  }
  console.log('Seeding GrowdataMarketMakingPair complete!');
}

async function seedGrowdataArbitragePair(
  repository: Repository<GrowdataArbitragePair>,
) {
  for (const pair of defaultArbitragePairs) {
    const exists = await repository.findOneBy({ id: pair.id });
    if (!exists) {
      await repository.save(pair);
    }
  }
  console.log('Seeding GrowdataArbitragePair complete!');
}

async function seedGrowdataSimplyGrowToken(
  repository: Repository<GrowdataSimplyGrowToken>,
) {
  for (const token of defaultSimplyGrowTokens) {
    const exists = await repository.findOneBy({ asset_id: token.asset_id });
    if (!exists) {
      await repository.save(token);
    }
  }
  console.log('Seeding GrowdataSimplyGrowToken complete!');
}

async function seedJwtSecretEnv() {
  if (!process.env.JWT_SECRET) {
    const newSecret = randomBytes(32).toString('hex'); // Generates a 64-character string
    appendFileSync('.env', `\nJWT_SECRET=${newSecret}`);
    console.log(
      'JWT_SECRET was not set. A new secret has been generated and added to .env',
    );
  } else {
    console.log('JWT_SECRET is already set, skip seeding');
  }
}

async function run() {
  const dataSource = await connectToDatabase();
  await seedSpotdataTradingPair(dataSource.getRepository(SpotdataTradingPair));
  await seedGrowdataMarketMakingPair(
    dataSource.getRepository(GrowdataMarketMakingPair),
  );
  await seedGrowdataArbitragePair(
    dataSource.getRepository(GrowdataArbitragePair),
  );
  await seedGrowdataSimplyGrowToken(
    dataSource.getRepository(GrowdataSimplyGrowToken),
  );
  await seedJwtSecretEnv();
  await dataSource.destroy();
}

run();
