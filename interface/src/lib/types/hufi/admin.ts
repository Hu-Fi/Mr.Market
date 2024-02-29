export interface AdminPasswordResp {
  status: number,
  result: boolean,
}

export interface AdminSpotOrder {
  type: string,
  userID: string,
  exchange: string,
  symbol: string,
  amount: string,
  time: string,
  state: string,
}

export interface AdminSwapOrder {
  base: string,
  target: string,
  userID: string,
  amount: string,
  time: string,
  state: string,
}

export interface AdminSingleKey {
  exchange: string,
  state: string,
  last_update: string,
  key: string,
}