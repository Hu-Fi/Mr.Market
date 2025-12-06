import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class UpdateGlobalFeeDto {
  @IsString()
  @IsOptional()
  spot_fee: string;

  @IsString()
  @IsOptional()
  market_making_fee: string;

  @IsBoolean()
  @IsOptional()
  enable_spot_fee: boolean;

  @IsBoolean()
  @IsOptional()
  enable_market_making_fee: boolean;
}
