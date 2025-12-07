import {
  memoPreDecode,
  encodeMarketMakingCreateMemo,
  decodeMarketMakingCreateMemo,
  encodeSimplyGrowCreateMemo,
  decodeSimplyGrowCreateMemo,
} from './memo';

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

    const { payload } = memoPreDecode(encodedMemo);
    const result = decodeMarketMakingCreateMemo(payload);
    expect(result).toEqual({
      version: 1,
      tradingType: 'Market Making',
      action: 'create',
      marketMakingPairId: '0776b00f-95c0-46f9-85e4-7b8e7ca51e94',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
    });
  });
});
