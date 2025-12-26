import { findCoinIconBySymbol } from "$lib/helpers/helpers";
import emptyToken from "$lib/images/empty-token.svg";

export interface ApiCampaign {
  chain_id: number;
  address: string;
  type: string;
  exchange_name: string;
  symbol: string;
  details: {
    daily_volume_target?: number;
    minimum_balance_target?: number;
    daily_balance_target?: number;
  };
  start_date: string;
  end_date: string;
  fund_amount: string;
  fund_token: string;
  fund_token_symbol: string;
  fund_token_decimals: number;
  status: string;
  escrow_status: string;
  amount_paid: string;
  daily_paid_amounts: any[];
  launcher: string;
  exchange_oracle: string;
  recording_oracle: string;
  reputation_oracle: string;
  balance: string;
  exchange_oracle_fee_percent: number;
  recording_oracle_fee_percent: number;
  reputation_oracle_fee_percent: number;
  intermediate_results_url: string | null;
  final_results_url: string | null;
  reserved_funds: string;
}

export interface FormattedCampaign {
  id: string;
  type: string;
  status: string;
  address: string;
  startDate: string;
  endDate: string;
  totalFundedAmount: string;
  amountPaid: string;
  oracleFees: string;
  targetLabel: string;
  targetValue: string;
  reservedFunds: string;
  campaignResults: string;
  exchange: string;
  symbol: string;
  symbolIcon: string;
}

// Exported utility functions for use in components
export function formatAmount(amount: string, decimals: number, symbol: string): string {
  const value = Number(amount) / Math.pow(10, decimals);
  return `${value.toLocaleString()} ${symbol}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatType(type: string): string {
  return type.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

export function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

export function formatExchangeName(name: string): string {
  const exchangeNames: Record<string, string> = {
    'mexc': 'MEXC Global',
    'gate': 'Gate.io',
    'binance': 'Binance',
    'okx': 'OKX',
    'bybit': 'Bybit',
    'huobi': 'HTX',
    'kucoin': 'KuCoin'
  };

  return exchangeNames[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1);
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getTargetLabel(type: string): string {
  switch (type) {
    case 'MARKET_MAKING':
      return 'Daily Volume Target';
    case 'THRESHOLD':
      return 'Minimum Balance Target';
    case 'HOLDING':
      return 'Daily Balance Target';
    default:
      return 'Target';
  }
}

export function getTargetValue(campaign: ApiCampaign): string {
  const { type, details, fund_token_symbol } = campaign;

  if (type === 'MARKET_MAKING' && details.daily_volume_target) {
    return `${details.daily_volume_target.toLocaleString()} ${fund_token_symbol}`;
  }

  if (type === 'THRESHOLD' && details.minimum_balance_target) {
    return `${details.minimum_balance_target.toLocaleString()} ${campaign.symbol}`;
  }

  if (type === 'HOLDING' && details.daily_balance_target) {
    return `${details.daily_balance_target.toLocaleString()} ${campaign.symbol}`;
  }

  return 'N/A';
}

export function calculateAmountPaid(fundAmount: string, balance: string, decimals: number, symbol: string): string {
  const funded = Number(fundAmount);
  const remaining = Number(balance);
  const paid = funded - remaining;
  const value = paid / Math.pow(10, decimals);
  return `${value.toLocaleString()} ${symbol}`;
}

export function calculateOracleFees(
  fundAmount: string,
  decimals: number,
  symbol: string,
  exchangeFeePercent: number,
  recordingFeePercent: number,
  reputationFeePercent: number
): string {
  const totalFeePercent = exchangeFeePercent + recordingFeePercent + reputationFeePercent;
  const value = Number(fundAmount) / Math.pow(10, decimals);
  const fee = value * (totalFeePercent / 100);
  return `${fee.toLocaleString()} ${symbol} (${totalFeePercent}%)`;
}

export function getCampaignResults(campaign: ApiCampaign): string {
  if (campaign.final_results_url) {
    return 'Completed';
  }
  if (campaign.intermediate_results_url) {
    return 'Intermediate';
  }
  return 'N/A';
}

export function getSymbolIcon(symbol: string): string {
  return findCoinIconBySymbol(symbol.split('/')[0]) || emptyToken;
}

// Legacy function for backward compatibility
export function formatCampaign(campaign: ApiCampaign): FormattedCampaign {
  const symbolIcon = getSymbolIcon(campaign.symbol);

  return {
    id: campaign.address,
    type: formatType(campaign.type),
    status: formatStatus(campaign.status),
    address: shortenAddress(campaign.address),
    startDate: formatDate(campaign.start_date),
    endDate: formatDate(campaign.end_date),
    totalFundedAmount: formatAmount(campaign.fund_amount, campaign.fund_token_decimals, campaign.fund_token_symbol),
    amountPaid: calculateAmountPaid(campaign.fund_amount, campaign.balance, campaign.fund_token_decimals, campaign.fund_token_symbol),
    oracleFees: calculateOracleFees(
      campaign.fund_amount,
      campaign.fund_token_decimals,
      campaign.fund_token_symbol,
      campaign.exchange_oracle_fee_percent,
      campaign.recording_oracle_fee_percent,
      campaign.reputation_oracle_fee_percent
    ),
    targetLabel: getTargetLabel(campaign.type),
    targetValue: getTargetValue(campaign),
    reservedFunds: formatAmount(campaign.reserved_funds, campaign.fund_token_decimals, campaign.fund_token_symbol),
    campaignResults: getCampaignResults(campaign),
    exchange: formatExchangeName(campaign.exchange_name),
    symbol: campaign.symbol,
    symbolIcon
  };
}

export function formatCampaigns(campaigns: ApiCampaign[]): FormattedCampaign[] {
  return campaigns.map(formatCampaign);
}
