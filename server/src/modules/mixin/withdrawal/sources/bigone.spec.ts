import { assetIDtoSymbol, getFeeBySymbol } from './bigone';

describe('Get symbol with mixin asset id', () => {
  it('asset symbol', () => {
    expect(assetIDtoSymbol('c6d0c728-2624-429b-8e0d-d9d19b6592fa')).toBe('BTC');
    expect(assetIDtoSymbol('43d61dcd-e413-450d-80b8-101d5e903357')).toBe('ETH');
  });
});

describe('Get Fee from BigOne', () => {
  it('BTC fee', async () => {
    await getFeeBySymbol('BTC')
  });
  it('ETH fee', async () => {
    await getFeeBySymbol('ETH')
  });
});
