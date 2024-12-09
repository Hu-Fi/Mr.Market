// This file is used to seed the database with initial data
// Make sure to run this file after the database and the table is created (after migration:run)

import * as dotenv from 'dotenv';
import { DataSource, Repository } from 'typeorm';
import {
  GrowdataExchange,
  GrowdataMarketMakingPair,
  GrowdataArbitragePair,
  GrowdataSimplyGrowToken,
} from '../../common/entities/grow-data.entity';
import {
  defaultArbitragePairs,
  defaultExchanges,
  defaultMarketMakingPairs,
  defaultSimplyGrowTokens,
  defaultSpotdataTradingPairs,
} from './defaultSeedValues';
import { SpotdataTradingPair } from '../../common/entities/spot-data.entity';

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
      GrowdataExchange,
      GrowdataMarketMakingPair,
      GrowdataArbitragePair,
      GrowdataSimplyGrowToken,
      SpotdataTradingPair,
    ],
    synchronize: false,
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

async function seedGrowdataExchange(repository: Repository<GrowdataExchange>) {
  for (const exchange of defaultExchanges) {
    const exists = await repository.findOneBy({
      exchange_id: exchange.exchange_id,
    });
    if (!exists) {
      await repository.save(exchange);
    }
  }
  console.log('Seeding GrowdataExchange complete!');
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

async function run() {
  const dataSource = await connectToDatabase();
  await seedSpotdataTradingPair(dataSource.getRepository(SpotdataTradingPair));
  await seedGrowdataExchange(dataSource.getRepository(GrowdataExchange));
  await seedGrowdataMarketMakingPair(
    dataSource.getRepository(GrowdataMarketMakingPair),
  );
  await seedGrowdataArbitragePair(
    dataSource.getRepository(GrowdataArbitragePair),
  );
  await seedGrowdataSimplyGrowToken(
    dataSource.getRepository(GrowdataSimplyGrowToken),
  );
  await dataSource.destroy();
}

run();
