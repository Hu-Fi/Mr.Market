import { describe, it, expect, vi } from 'vitest';
import { GenerateSpotMemo, GenerateArbitrageMemo, GenerateMarketMakingMemo } from './memo';

vi.mock('$env/dynamic/public', () => {
  return {
    env: {
      AppURL: '',
      SHOW_BAR: '',
      BOT_ID: '',
      OAUTH_SCOPE: '',
      MIXIN_MESSENGER_INSTALL: '',
      MIXIN_API_BASE_URL: '',
    }
  }
});describe('Memo Generation', () => {

  it('Generates correct Spot Memo', () => {
    const memo = GenerateSpotMemo({
      limit: true,
      buy: true,
      symbol: 'BTC/USDT',
      exchange: 'Binance',
      price: '50000',
    });
    // Assuming the PAIRS_MAP_REVERSED['BTC/USDT-ERC20'] = 'Z7GC'
    const encoded = Buffer.from('SP:LB:01:Z7GC:50000:', 'binary').toString('base64').replaceAll('=', '');
    console.log(`GenerateSpotMemo: ${encoded}`)
    expect(memo).toBe(encoded);
  });

  it('Generates correct Arbitrage Memo', () => {
    const memo = GenerateArbitrageMemo({
      action: 'CR',
      exchangeA: 'Binance',
      exchangeB: 'Bitfinex',
      symbol: 'BTC/USDT',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
    });
    // Assuming the PAIRS_MAP_REVERSED['BTC/USDT'] = 'Z7GC'
    const encoded = Buffer.from('AR:CR:01:02:Z7GC:b0177350-ae29-43ec-a26e-d46f821e416e', 'binary').toString('base64').replaceAll('=', '');
    console.log(`GenerateArbMemo: ${encoded}`)
    expect(memo).toBe(encoded);
  });

  it('Generates correct Market Making Memo', () => {
    const memo = GenerateMarketMakingMemo({
      action: 'DE',
      exchange: 'okx',
      symbol: 'ETH/USDT',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
    });
    // Assuming the PAIRS_MAP_REVERSED['ETH/USDT'] = 'MX5C'
    const encoded = Buffer.from('MM:DE:04:MX5C:b0177350-ae29-43ec-a26e-d46f821e416e', 'binary').toString('base64').replaceAll('=', '');
    console.log(`GenerateMMMemo: ${encoded}`)
    expect(memo).toBe(encoded);
  });

});
