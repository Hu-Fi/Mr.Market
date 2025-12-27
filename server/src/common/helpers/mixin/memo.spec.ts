import {
  memoPreDecode,
  encodeMarketMakingCreateMemo,
  decodeMarketMakingCreateMemo,
  encodeSimplyGrowCreateMemo,
  decodeSimplyGrowCreateMemo,
} from './memo';
import { TradingTypeValue } from 'src/common/types/memo/memo';

describe('decodeSimplyGrowCreateMemo', () => {
  it('test encodeSimplyGrowCreateMemo', () => {
    const memo = encodeSimplyGrowCreateMemo({
      version: 1,
      tradingType: 'Simply Grow',
      action: 'create',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
    });
    expect(memo).toBeDefined();
  });

  it('test decodeSimplyGrowCreateMemo', () => {
    const memo = '5JkNjkChhHjzsFr6cm4yAbJPUGVDST6tk9Cxdapvvq9kFgBmJuQVoahd8v';
    const { payload } = memoPreDecode(memo);
    const result = decodeSimplyGrowCreateMemo(payload);

    expect(result).toEqual({
      version: 1,
      tradingType: 'Simply Grow',
      action: 'create',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
    });
  });

  it('test with interface', () => {
    const memo = '5JkQ2HgrejnStAJyD1UyH3p5t2EfNH4yqvkqP54Bf4ZxFt9QhB7JGVSo8f';
    const { payload } = memoPreDecode(memo);
    const result = decodeSimplyGrowCreateMemo(payload);

    expect(result).toEqual({
      version: 1,
      tradingType: 'Simply Grow',
      action: 'create',
      orderId: 'c9f52c4c-1d03-47ce-89a3-bba2cd48f5d6',
    });
  });

  it('should encode and decode Simply Grow deposit action', () => {
    const details = {
      version: 1,
      tradingType: 'Simply Grow',
      action: 'deposit',
      orderId: 'c9f52c4c-1d03-47ce-89a3-bba2cd48f5d6',
    };
    const memo = encodeSimplyGrowCreateMemo(details);
    const { payload } = memoPreDecode(memo);
    const result = decodeSimplyGrowCreateMemo(payload);

    expect(result).toEqual(details);
  });

  it('should throw error when encoding SimplyGrow with invalid details', () => {
    expect(() => {
      encodeSimplyGrowCreateMemo({
        version: 1,
        tradingType: 'Invalid Type' as TradingTypeValue,
        action: 'create',
        orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
      });
    }).toThrow('Invalid memo details');

    expect(() => {
      encodeSimplyGrowCreateMemo({
        version: 1,
        tradingType: 'Simply Grow',
        action: 'invalid_action' as any,
        orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
      });
    }).toThrow('Invalid memo details');
  });
});

describe('decodeMarketMakingCreateMemo', () => {
  it('should throw an error for invalid checksum (memo without 6 bytes)', () => {
    const invalidMemo =
      '3NB9J7yT6msdnWVto4W5LxRyQndoLfzwA8TJcuBtKcTWLqG5n8S3pUBBiVjVLR9PekLU8sRo6h';
    expect(() => {
      const { payload } = memoPreDecode(invalidMemo);
      decodeMarketMakingCreateMemo(payload);
    }).toThrow('Invalid checksum');
  });

  it('should return market making memo details', () => {
    const encodedMemo = encodeMarketMakingCreateMemo({
      version: 1,
      tradingType: 'Market Making',
      action: 'create',
      marketMakingPairId: '0776b00f-95c0-46f9-85e4-7b8e7ca51e94',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
    });

    console.log(`encodedMemo: ${encodedMemo}`);
    const { payload } = memoPreDecode(
      'f243yJSNnb9QQ7azcKFd5tzKQS8xX62VVYkk8KWwDAAkuFVXBwvw',
    );
    const result = decodeMarketMakingCreateMemo(payload);
    expect(result).toEqual({
      version: 1,
      tradingType: 'Market Making',
      action: 'create',
      marketMakingPairId: '0776b00f-95c0-46f9-85e4-7b8e7ca51e94',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
    });
  });

  it('should throw error when encoding MarketMaking with invalid details', () => {
    expect(() => {
      encodeMarketMakingCreateMemo({
        version: 1,
        tradingType: 'Invalid Type' as TradingTypeValue,
        action: 'create',
        marketMakingPairId: '0776b00f-95c0-46f9-85e4-7b8e7ca51e94',
        orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
      });
    }).toThrow('Invalid memo details');
  });
});
