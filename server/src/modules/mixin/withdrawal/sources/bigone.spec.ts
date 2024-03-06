import { getFeeBySymbol } from './bigone';

describe('Get Fee from BigOne', () => {
  it('bigone', async () => {
    await getFeeBySymbol('BTC');
  });
});
