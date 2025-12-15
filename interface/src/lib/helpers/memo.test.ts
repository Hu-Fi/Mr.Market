import { describe, it, expect, vi } from 'vitest';
import { encodeArbitrageCreateMemo, encodeMarketMakingCreateMemo, encodeSimplyGrowCreateMemo } from './memo';

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

describe('Market making Memo', () => {
  it('Generate correcnt create market making memo', () => {
    const encodedMemo = encodeMarketMakingCreateMemo({
      version: 1,
      tradingType: 'Market Making',
      action: 'create',
      marketMakingPairId: '0776b00f-95c0-46f9-85e4-7b8e7ca51e94',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
    });
    console.log(`encodedMemo: ${encodedMemo}`)
    expect(encodedMemo).toBe('f243yJSNnb9QQ7azcKFd5tzKQS8xX62VVYkk8KWwDAAkuFVXBwvw')
  })
})

describe('Simply Grow Memo', () => {
  it('Generate correcnt create simply grow memo', () => {
    const encodedMemo = encodeSimplyGrowCreateMemo({
      version: 1,
      tradingType: 'Simply Grow',
      action: 'create',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
      rewardAddress: '0x7dfa0e4456cb794d1f46cc8e0e5882dc3ad6d6d3',
    });
    expect(encodedMemo).toBe('5JkNjkChhHjzsFr6cm4yAbJPUGVDST6tk9Cxdapvvq9kFgBmJuQVoahd8v')
  })
})
