import type { StrategyDto } from "$lib/types/hufi/arbitrage";
import { HUFI_BACKEND_URL } from "../constants"

export const executeArbitrage = async (strategyParamsDto: StrategyDto) => {
  const response = await fetch(`${HUFI_BACKEND_URL}/strategy/execute-arbitrage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(strategyParamsDto),
  });

  if (response.ok) {
    const data = await response.json();
    return data
  } else {
    return {}
  }
}

export const stopArbitrage = async (userId: string, clientId: string) => {
  const response = await fetch(`${HUFI_BACKEND_URL}/strategy/arbitrage/stop?userId=${userId}&clientId=${clientId}`, {
    method: 'GET',
  });

  if (response.ok) {
    const data = await response.json();
    return data
  } else {
    return {}
  }
}