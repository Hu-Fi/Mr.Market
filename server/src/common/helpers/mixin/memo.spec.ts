import {
  encodeArbitrageCreateMemo,
  decodeArbitrageCreateMemo,
  memoPreDecode,
  encodeMarketMakingCreateMemo,
  decodeMarketMakingCreateMemo,
  encodeSimplyGrowCreateMemo,
  decodeSimplyGrowCreateMemo,
  encodeSpotLimitOrderMemo,
  decodeSpotLimitOrderMemo,
  encodeSpotMarketOrderMemo,
  decodeSpotMarketOrderMemo,
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

describe('Spot Trading Memo Functions', () => {
  const spotLimitBuyOrderDetails = {
    version: 1,
    tradingType: 'Spot',
    spotOrderType: 'limit',
    action: 'buy',
    tradingPairId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
    limitPrice: '100',
  };

  const spotLimitSellOrderDetails = {
    version: 1,
    tradingType: 'Spot',
    spotOrderType: 'limit',
    action: 'sell',
    tradingPairId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
    limitPrice: '100',
  };

  const spotMarketBuyOrderDetails = {
    version: 1,
    tradingType: 'Spot',
    spotOrderType: 'market',
    action: 'buy',
    tradingPairId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
  };

  const spotMarketSellOrderDetails = {
    version: 1,
    tradingType: 'Spot',
    spotOrderType: 'market',
    action: 'sell',
    tradingPairId: 'b0177350-ae29-43ec-a26e-d46f821e416e',
  };
  describe('encodeSpotLimitBuyOrderMemo', () => {
    it('should encode a spot limit buy order memo correctly', () => {
      const encodedMemo = encodeSpotLimitOrderMemo(spotLimitBuyOrderDetails);
      console.log('encodedMemo', encodedMemo);

      expect(encodedMemo).toBe('bbouDgSykQLX1SzBrdbSLXcjqc7ogJJtpu1HQ');
    });
  });

  describe('decodeSpotLimitBuyOrderMemo', () => {
    it('should decode a spot limit buy order memo correctly', () => {
      const encodedMemo = 'bbouDgSykQLX1SzBrdbSLXcjqc7ogJJtpu1HQ';
      const { payload } = memoPreDecode(encodedMemo);
      const decodedDetails = decodeSpotLimitOrderMemo(payload);

      expect(decodedDetails).toEqual(spotLimitBuyOrderDetails);
    });
  });

  describe('encodeSpotLimitSellOrderMemo', () => {
    it('should encode a spot limit sell order memo correctly', () => {
      const encodedMemo = encodeSpotLimitOrderMemo(spotLimitSellOrderDetails);
      console.log('encodedMemo', encodedMemo);

      expect(encodedMemo).toBe('bboud23xrhdEBus1HmgTkrwDxsuSBZFbowkHg');
    });
  });

  describe('decodeSpotLimitSellOrderMemo', () => {
    it('should decode a spot limit sell order memo correctly', () => {
      const encodedMemo = 'bboud23xrhdEBus1HmgTkrwDxsuSBZFbowkHg';
      const { payload } = memoPreDecode(encodedMemo);
      const decodedDetails = decodeSpotLimitOrderMemo(payload);

      expect(decodedDetails).toEqual(spotLimitSellOrderDetails);
    });
  });

  describe('encodeSpotMarketBuyOrderMemo', () => {
    it('should encode a spot market buy order memo correctly', () => {
      const encodedMemo = encodeSpotMarketOrderMemo(spotMarketBuyOrderDetails);
      console.log('encodedMemo', encodedMemo);

      expect(encodedMemo).toBe('6HgjiPeqKVnJ9fnNKfx3EQGxPjGbNDS6');
    });
  });

  describe('decodeSpotMarketBuyOrderMemo', () => {
    it('should decode a spot market buy order memo correctly', () => {
      const encodedMemo = '6HgjiPeqKVnJ9fnNKfx3EQGxPjGbNDS6';
      const { payload } = memoPreDecode(encodedMemo);
      const decodedDetails = decodeSpotMarketOrderMemo(payload);

      expect(decodedDetails).toEqual(spotMarketBuyOrderDetails);
    });
  });

  describe('encodeSpotMarketSellOrderMemo', () => {
    it('should encode a spot market sell order memo correctly', () => {
      const encodedMemo = encodeSpotMarketOrderMemo(spotMarketSellOrderDetails);
      console.log('encodedMemo', encodedMemo);

      expect(encodedMemo).toBe('6HgjmxWaGoZm9zwTH7vtjkervCE2Mjio');
    });
  });

  describe('decodeSpotMarketSellOrderMemo', () => {
    it('should decode a spot market sell order memo correctly', () => {
      const encodedMemo = '6HgjmxWaGoZm9zwTH7vtjkervCE2Mjio';
      const { payload } = memoPreDecode(encodedMemo);
      const decodedDetails = decodeSpotMarketOrderMemo(payload);

      expect(decodedDetails).toEqual(spotMarketSellOrderDetails);
    });
  });
});
