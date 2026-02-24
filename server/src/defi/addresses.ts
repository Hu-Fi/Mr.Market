export type DexId = 'uniswapV3' | 'pancakeV3';

export type DexAddresses = {
  factory: string;
  router: string;
  quoterV2: string;
  weth: string; // canonical wrapped native for the chain
};

/**
 * IMPORTANT: Only put addresses you are certain about.
 * Fill in Pancake v3 addresses
 */
export const DEX_ADDRESSES: Record<DexId, Record<number, DexAddresses>> = {
  uniswapV3: {
    // Ethereum mainnet
    1: {
      factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      quoterV2: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    // Arbitrum
    42161: {
      factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      quoterV2: '0x655C406EBFa14EE2006250925e54ec43AD184f8B',
      weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    },
    // Polygon
    137: {
      factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      quoterV2: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      weth: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    },
  },
  pancakeV3: {
    56: {
      factory: '0xD7B6E04e3C8939A58A1d2641d3cA70E3fB1d6e48',
      router: '0x8F352E7bD04327e9DF20D4fE3259Dce0a1B0Fc75',
      quoterV2: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6', // Same interface as Uniswap V3 Quoter
      weth: '0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
    },
  },
};
