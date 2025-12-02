import { IsString, IsBoolean, IsUUID, IsOptional } from 'class-validator';

// DTO for SpotdataTradingPair
export class SpotdataTradingPairDto {
  @IsUUID()
  id: string;

  @IsString()
  ccxt_id: string;

  @IsString()
  symbol: string;

  @IsString()
  exchange_id: string;

  @IsString()
  amount_significant_figures: string;

  @IsString()
  price_significant_figures: string;

  @IsString()
  buy_decimal_digits: string;

  @IsString()
  sell_decimal_digits: string;

  @IsString()
  max_buy_amount: string;

  @IsString()
  max_sell_amount: string;

  @IsString()
  base_asset_id: string;

  @IsString()
  quote_asset_id: string;

  @IsString()
  @IsOptional()
  custom_fee_rate: string;

  @IsBoolean()
  enable: boolean;
}
