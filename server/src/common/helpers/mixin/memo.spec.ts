import {
  encodeArbitrageCreateMemo,
  decodeArbitrageCreateMemo,
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
      rewardAddress: '0x7dfa0e4456cb794d1f46cc8e0e5882dc3ad6d6d3',
    });
    expect(memo).toBe(
      '5JkNjkChhHjzsFr6cm4yAbJPUGVDST6tk9Cxdapvvq9kFgBmJuQVoahd8v',
    );
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
      rewardAddress: '0x7dFA0E4456Cb794D1F46CC8E0e5882DC3AD6d6D3',
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
      rewardAddress: '0x1AE60D36412a6745fce4d4935FF5Bf2b8139a371',
    });
  });
});

describe('decodeArbitrageCreateMemo', () => {
  it('should throw an error for invalid checksum (memo without 4 bytes checksum)', () => {
    const invalidMemo =
      '3NB9J7yT6msdnWVto4W5LxRyQndoLfzwA8TJcuBtKcTWLqG5n8S3pUBBiVjVLR9PekLU8sRo6h7M';
    expect(() => {
      const { payload } = memoPreDecode(invalidMemo);
      decodeArbitrageCreateMemo(payload);
    }).toThrow('Invalid checksum');
  });

  it('should return arbtirage memo details', () => {
    const encodedMemo = encodeArbitrageCreateMemo({
      version: 1,
      tradingType: 'Arbitrage',
      action: 'create',
      arbitragePairId: '0776b00f-95c0-46f9-85e4-7b8e7ca51e94',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
      rewardAddress: '0x0000000000000000000000000000000000000000',
    });

    const { payload } = memoPreDecode(encodedMemo);
    const result = decodeArbitrageCreateMemo(payload);
    expect(result).toEqual({
      version: 1,
      tradingType: 'Arbitrage',
      action: 'create',
      arbitragePairId: '0776b00f-95c0-46f9-85e4-7b8e7ca51e94',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
      rewardAddress: '0x0000000000000000000000000000000000000000',
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
      rewardAddress: '0x0000000000000000000000000000000000000000',
    });

    const { payload } = memoPreDecode(encodedMemo);
    const result = decodeMarketMakingCreateMemo(payload);
    expect(result).toEqual({
      version: 1,
      tradingType: 'Market Making',
      action: 'create',
      marketMakingPairId: '0776b00f-95c0-46f9-85e4-7b8e7ca51e94',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
      rewardAddress: '0x0000000000000000000000000000000000000000',
    });
  });
});
