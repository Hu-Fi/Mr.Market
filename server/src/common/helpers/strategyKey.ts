export interface StrategyKey {
  type: 'arbitrage' | 'pureMarketMaking';
  user_id: string;
  client_id: string;
}

export const createStrategyKey = (key: StrategyKey) => {
  return `${key.user_id}-${key.client_id}-${key.type}`;
};
