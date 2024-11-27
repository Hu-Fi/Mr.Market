import {
  decodeSpotMemo,
  encodeArbitrageCreateMemo,
  decodeArbitrageCreateMemo,
  memoPreDecode,
  encodeMarketMakingCreateMemo,
  decodeMarketMakingCreateMemo,
  encodeSimplyGrowCreateMemo,
  decodeSimplyGrowCreateMemo,
} from './memo';
import {
  TARDING_TYPE_MAP,
  SPOT_ORDER_TYPE_MAP,
  SPOT_EXCHANGE_MAP,
} from 'src/common/constants/memo';

describe('decodeSimplyGrowCreateMemo', () => {
  it('test encodeSimplyGrowCreateMemo', () => {
    const memo = encodeSimplyGrowCreateMemo({
      version: 1,
      tradingType: 'Simply Grow',
      action: 'create',
      orderId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
      rewardAddress: '0x7dfa0e4456cb794d1f46cc8e0e5882dc3ad6d6d3',
    });
    console.log(`encodeSimplyGrowCreateMemo: ${memo}`);
    expect(memo).toBe(
      '5JkNjkChhHjzsFr6cm4yAbJPUGVDST6tk9Cxdapvvq9kFgBmJuQVoahd8v',
    );
  });

  it('test decodeSimplyGrowCreateMemo', () => {
    const memo = '5JkNjkChhHjzsFr6cm4yAbJPUGVDST6tk9Cxdapvvq9kFgBmJuQVoahd8v';
    const { payload } = memoPreDecode(memo);
    const result = decodeSimplyGrowCreateMemo(payload);
    console.log(`decodeSimplyGrowCreateMemo: ${JSON.stringify(result)}`);
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
    console.log(`decodeSimplyGrowCreateMemo: ${JSON.stringify(result)}`);
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
    console.log(`encodeArbitrageCreateMemo: ${encodedMemo}`);
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
    console.log(`encodeMarketMakingCreateMemo: ${encodedMemo}`);
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

describe.skip('decodeSpotMemo', () => {
  it('should decode a valid spot memo correctly', () => {
    const validMemo = 'U1A6TEI6MDE6WjdHQzo1MDAwMDo';
    const memo = Buffer.from(validMemo, 'base64').toString('utf-8');
    const expectedResult = {
      tradingType: TARDING_TYPE_MAP['SP'],
      spotOrderType: SPOT_ORDER_TYPE_MAP['LB'],
      exchangeName: SPOT_EXCHANGE_MAP['01'],
      destId: 'Z7GC',
      limitPrice: '50000',
      refId: '',
    };

    const decodedMemo = decodeSpotMemo(memo);
    expect(decodedMemo).toEqual(expectedResult);
  });

  it('should handle memo generated by frontend', () => {
    const validMemo = 'U1A6TUI6MDQ6WjdHQzo2OTYyNy45Og';
    const memo = Buffer.from(validMemo, 'base64').toString('utf-8');
    const expectedResult = {
      tradingType: TARDING_TYPE_MAP['SP'],
      spotOrderType: SPOT_ORDER_TYPE_MAP['MB'],
      exchangeName: SPOT_EXCHANGE_MAP['04'],
      destId: 'Z7GC',
      limitPrice: '69627.9',
      refId: '',
    };
    const decodedMemo = decodeSpotMemo(memo);
    expect(decodedMemo).toEqual(expectedResult);
  });

  it('should handle a memo without limit price and refId', () => {
    const memoWithoutLimitPriceAndRefId = 'U1A6TUI6MDI6TU1NTQ==';
    const memo = Buffer.from(memoWithoutLimitPriceAndRefId, 'base64').toString(
      'utf-8',
    );
    const expectedResult = {
      tradingType: TARDING_TYPE_MAP['SP'],
      spotOrderType: SPOT_ORDER_TYPE_MAP['MB'],
      exchangeName: SPOT_EXCHANGE_MAP['02'],
      destId: 'MMMM',
      limitPrice: undefined,
      refId: undefined,
    };

    const decodedMemo = decodeSpotMemo(memo);
    expect(decodedMemo).toEqual(expectedResult);
  });

  it('should throw an error for an invalid base64 encoded memo', () => {
    const invalidMemo = 'invalidBase64Memo';
    expect(decodeSpotMemo(invalidMemo)).toStrictEqual({
      destId: undefined,
      exchangeName: undefined,
      limitPrice: undefined,
      refId: undefined,
      spotOrderType: undefined,
      tradingType: undefined,
    });
  });
});
