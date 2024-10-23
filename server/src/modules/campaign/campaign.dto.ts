import { ApiProperty } from '@nestjs/swagger';

export class CampaignDataDto {
  @ApiProperty()
  chainId: number;

  @ApiProperty()
  requesterAddress: string;

  @ApiProperty()
  exchangeName: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  fundAmount: string;

  @ApiProperty()
  startBlock: number;

  @ApiProperty()
  endBlock: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  amountPaid: string;

  @ApiProperty()
  balance: string;

  @ApiProperty()
  count: string;

  @ApiProperty()
  factoryAddress: string;

  @ApiProperty()
  finalResultsUrl?: string;

  @ApiProperty()
  intermediateResultsUrl?: string;

  @ApiProperty()
  launcher: string;

  @ApiProperty()
  manifestHash?: string;

  @ApiProperty()
  manifestUrl?: string;

  @ApiProperty()
  recordingOracle?: string;

  @ApiProperty()
  recordingOracleFee?: string;

  @ApiProperty()
  reputationOracle?: string;

  @ApiProperty()
  reputationOracleFee?: string;

  @ApiProperty()
  exchangeOracle?: string;

  @ApiProperty()
  exchangeOracleFee?: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  totalFundedAmount: string;

  @ApiProperty()
  createdAt: string;
}
