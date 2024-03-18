export const decodeTicker = (exchangeName: string, data: any) => {
  switch (exchangeName) {
    case 'mexc':
      return {
        timestamp: data.timestamp,
        last: data.ask,
        open: data.ask,
        close: data.ask,
        volume: undefined,
      };
    case 'bitfinex':
    case 'binance':
    default:
      return data;
  }
};
