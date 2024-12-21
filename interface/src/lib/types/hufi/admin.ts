export interface AdminPasswordResp {
  access_token: string
}

export interface AdminSpotOrder {
  type: string,
  userID: string,
  orderID: string,
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

export interface AdminCCXTCurrency {
  id: string;
  code: string;
  info: Record<string, unknown>;
  name: string;
  type: string;
  deposit: boolean;
  withdraw: boolean;
  precision: number;
  limits: {
      amount: Record<string, unknown>;
      withdraw: Record<string, unknown>;
  };
  networks: {
      [key: string]: {
          id: string;
          network: string;
          deposit: boolean;
          withdraw: boolean;
          active: boolean;
          fee: number;
          precision: number;
          limits: {
              deposit: {
                  min: string;
              };
              withdraw: {
                  min: string;
              };
          };
          info: Record<string, unknown>;
      };
  };
}