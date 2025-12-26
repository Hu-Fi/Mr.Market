import { IsString, IsBoolean, IsOptional, IsUUID } from 'class-validator';

// DTO for GrowdataExchange
export class GrowdataExchangeDto {
  @IsString()
  exchange_id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  icon_url: string;

  @IsBoolean()
  enable: boolean;
}

// DTO for GrowdataSimplyGrowToken
export class GrowdataSimplyGrowTokenDto {
  @IsUUID()
  asset_id: string;

  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsString()
  icon_url: string;

  @IsString()
  @IsOptional()
  apy: string;

  @IsBoolean()
  enable: boolean;
}

// DTO for GrowdataArbitragePair
export class GrowdataArbitragePairDto {
  @IsUUID()
  id: string;

  @IsString()
  symbol: string;

  @IsString()
  base_symbol: string;

  @IsString()
  quote_symbol: string;

  @IsUUID()
  base_asset_id: string;

  @IsString()
  base_icon_url: string;

  @IsUUID()
  quote_asset_id: string;

  @IsString()
  quote_icon_url: string;

  @IsString()
  @IsOptional()
  base_price: string;

  @IsString()
  @IsOptional()
  target_price: string;

  @IsString()
  base_exchange_id: string;

  @IsString()
  target_exchange_id: string;

  @IsBoolean()
  enable: boolean;
}

// DTO for GrowdataMarketMakingPair
export class GrowdataMarketMakingPairDto {
  @IsUUID()
  id: string;

  @IsString()
  symbol: string;

  @IsString()
  base_symbol: string;

  @IsString()
  quote_symbol: string;

  @IsUUID()
  base_asset_id: string;

  @IsString()
  base_icon_url: string;

  @IsUUID()
  quote_asset_id: string;

  @IsString()
  quote_icon_url: string;

  @IsString()
  @IsOptional()
  base_price: string;

  @IsString()
  @IsOptional()
  target_price: string;

  @IsString()
  exchange_id: string;

  @IsString()
  @IsOptional()
  custom_fee_rate: string;

  @IsBoolean()
  enable: boolean;
}
