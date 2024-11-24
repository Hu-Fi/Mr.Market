import { describe, it, expect, vi } from 'vitest';
import { GenerateSpotTradingMemo, GenerateArbitrageMemo, GenerateMarketMakingMemo, encodeArbitrageCreateMemo } from './memo';

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
});

describe('Arbitrage Memo', () => {
  it('Generate correcnt create arbitrage memo', () => {
    const memo = encodeArbitrageCreateMemo({
      version: 1,
      tradingType: 'Arbitrage',
      action: 'create',
      arbitragePairId: '0776b00f-95c0-46f9-85e4-7b8e7ca51e94',
      traceId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
      rewardAddress: '0x0000000000000000000000000000000000000000',
    });
    console.log(`encodeArbitrageCreateMemo: ${memo}`)
    expect(memo).toBe('3NB9J7yT6msdnWVto4W5LxRyQndoLfzwA8TJcuBtKcTWLqG5n8S3pUBBiVjVLR9PekLU8sRo6h7MFgy3')
  })
})

describe.skip('Memo Generation', () => {
  it('Generates correct Spot Memo', () => {
    const memo = GenerateSpotTradingMemo({
      limit: true,
      buy: true,
      symbol: 'BTC/USDT',
      exchange: 'Binance',
      price: '50000',
    });
    // Assuming the PAIRS_MAP_REVERSED['BTC/USDT-ERC20'] = 'Z7GC'
    const encoded = Buffer.from('SP:LB:01:Z7GC:50000:', 'binary').toString('base64').replaceAll('=', '');
    console.log(`GenerateSpotTradingMemo: ${encoded}`)
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
