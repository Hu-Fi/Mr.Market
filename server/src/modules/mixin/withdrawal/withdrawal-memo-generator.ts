/**
 * Withdrawal Memo Generator Utility
 * 
 * This utility helps generate withdrawal memos for testing and integration purposes.
 * Use this to create valid withdrawal memos that can be sent to the Mixin bot.
 */

import { encodeWithdrawalMemo } from '../common/helpers/mixin/memo';

/**
 * Generate a withdrawal memo for testing
 * 
 * @param destination - Blockchain address to withdraw to
 * @param destinationTag - Optional memo/tag for exchanges that require it (e.g., XRP, XLM)
 * @returns Base58-encoded withdrawal memo
 * 
 * @example
 * // Bitcoin withdrawal
 * const btcMemo = generateWithdrawalMemo('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
 * 
 * @example
 * // XRP withdrawal with destination tag
 * const xrpMemo = generateWithdrawalMemo('rN7n7otQDd6FczFgLdlqtyMVrn3e9vHiGd', '12345678');
 * 
 * @example
 * // Ethereum withdrawal
 * const ethMemo = generateWithdrawalMemo('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
 */
export function generateWithdrawalMemo(
    destination: string,
    destinationTag?: string,
): string {
    return encodeWithdrawalMemo({
        version: 1,
        tradingType: 'Withdrawal',
        destination,
        destinationTag,
    });
}

/**
 * Example withdrawal addresses for different blockchains
 */
export const EXAMPLE_ADDRESSES = {
    // Bitcoin
    BTC: {
        legacy: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        segwit: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        description: 'Bitcoin address (legacy P2PKH or native SegWit)',
    },

    // Ethereum
    ETH: {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        description: 'Ethereum address (ERC-20 compatible)',
    },

    // USDT (ERC-20)
    USDT_ETH: {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        description: 'USDT on Ethereum (ERC-20)',
    },

    // USDT (TRC-20)
    USDT_TRX: {
        address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
        description: 'USDT on Tron (TRC-20)',
    },

    // XRP with tag
    XRP: {
        address: 'rN7n7otQDd6FczFgLdlqtyMVrn3e9vHiGd',
        tag: '12345678',
        description: 'XRP address with destination tag',
    },

    // Stellar with memo
    XLM: {
        address: 'GBSTRUSD7IRX73RQZBL3RQUH6KS3O4NYFY3QCALDLZD77XMZOPWAVTUK',
        memo: 'test123',
        description: 'Stellar address with memo',
    },

    // EOS with memo
    EOS: {
        address: 'binancecleos',
        memo: 'abc12345',
        description: 'EOS account with memo',
    },
};

/**
 * Generate test memos for all supported blockchains
 */
export function generateTestMemos() {
    const memos: Record<string, { memo: string; description: string }> = {};

    // Bitcoin
    memos.BTC_LEGACY = {
        memo: generateWithdrawalMemo(EXAMPLE_ADDRESSES.BTC.legacy),
        description: EXAMPLE_ADDRESSES.BTC.description + ' (Legacy)',
    };

    memos.BTC_SEGWIT = {
        memo: generateWithdrawalMemo(EXAMPLE_ADDRESSES.BTC.segwit),
        description: EXAMPLE_ADDRESSES.BTC.description + ' (SegWit)',
    };

    // Ethereum
    memos.ETH = {
        memo: generateWithdrawalMemo(EXAMPLE_ADDRESSES.ETH.address),
        description: EXAMPLE_ADDRESSES.ETH.description,
    };

    // USDT ERC-20
    memos.USDT_ETH = {
        memo: generateWithdrawalMemo(EXAMPLE_ADDRESSES.USDT_ETH.address),
        description: EXAMPLE_ADDRESSES.USDT_ETH.description,
    };

    // USDT TRC-20
    memos.USDT_TRX = {
        memo: generateWithdrawalMemo(EXAMPLE_ADDRESSES.USDT_TRX.address),
        description: EXAMPLE_ADDRESSES.USDT_TRX.description,
    };

    // XRP with tag
    memos.XRP = {
        memo: generateWithdrawalMemo(
            EXAMPLE_ADDRESSES.XRP.address,
            EXAMPLE_ADDRESSES.XRP.tag,
        ),
        description: EXAMPLE_ADDRESSES.XRP.description,
    };

    // Stellar with memo
    memos.XLM = {
        memo: generateWithdrawalMemo(
            EXAMPLE_ADDRESSES.XLM.address,
            EXAMPLE_ADDRESSES.XLM.memo,
        ),
        description: EXAMPLE_ADDRESSES.XLM.description,
    };

    // EOS with memo
    memos.EOS = {
        memo: generateWithdrawalMemo(
            EXAMPLE_ADDRESSES.EOS.address,
            EXAMPLE_ADDRESSES.EOS.memo,
        ),
        description: EXAMPLE_ADDRESSES.EOS.description,
    };

    return memos;
}

/**
 * Main function - can be run directly for testing
 */
if (require.main === module) {
    console.log('=== Withdrawal Memo Generator ===\n');

    const testMemos = generateTestMemos();

    for (const [blockchain, data] of Object.entries(testMemos)) {
        console.log(`${blockchain}:`);
        console.log(`  Description: ${data.description}`);
        console.log(`  Memo: ${data.memo}`);
        console.log('');
    }

    console.log('\n=== How to Use ===');
    console.log('1. Choose the appropriate memo for your withdrawal blockchain');
    console.log('2. Send funds to the Mixin bot with the generated memo');
    console.log('3. The bot will decode the memo and execute the withdrawal');
    console.log('4. Monitor the withdrawal status in the database\n');

    console.log('=== Custom Memo Generation ===');
    console.log('Example code:');
    console.log(`
import { generateWithdrawalMemo } from './withdrawal-memo-generator';

// Generate memo for your custom address
const memo = generateWithdrawalMemo(
  '0xYourEthereumAddress',
  'optionalTag'
);
console.log('Generated memo:', memo);
  `);
}

export default {
    generateWithdrawalMemo,
    generateTestMemos,
    EXAMPLE_ADDRESSES,
};
