import { Injectable } from '@nestjs/common';
import { MixinClientService } from 'src/modules/mixin/client/mixin-client.service';
import { CustomLogger } from 'src/modules/infrastructure/logger/logger.service';

/**
 * Network Mapping Service
 * Maps Mixin Network asset IDs to CCXT exchange network identifiers
 */
@Injectable()
export class NetworkMappingService {
    private readonly logger = new CustomLogger(NetworkMappingService.name);

    // Cache for asset info to avoid repeated API calls
    private assetCache = new Map<string, any>();

    // Known chain_id to CCXT network mappings
    private readonly CHAIN_TO_NETWORK_MAP: Record<string, Record<string, string>> = {
        // Bitcoin
        'c6d0c728-2624-429b-8e0d-d9d19b6592fa': {
            default: 'BTC',
            BTC: 'BTC',
        },
        // Ethereum
        '43d61dcd-e413-450d-80b8-101d5e903357': {
            default: 'ERC20',
            ETH: 'ETH',
            USDT: 'ERC20',
            USDC: 'ERC20',
            DAI: 'ERC20',
            WBTC: 'ERC20',
        },
        // TRON
        '25dabac5-056a-48ff-b9f9-f67395dc407c': {
            default: 'TRC20',
            TRX: 'TRC20',
            USDT: 'TRC20',
            USDC: 'TRC20',
        },
        // BSC (Binance Smart Chain)
        '1949e683-6a08-49e2-b087-d6b72398588f': {
            default: 'BSC',
            BNB: 'BEP20',
            USDT: 'BEP20',
            USDC: 'BEP20',
            BUSD: 'BEP20',
        },
        // Polygon
        'b7938396-3f94-4e0a-9179-d3440718156f': {
            default: 'MATIC',
            MATIC: 'MATIC',
            USDT: 'MATIC',
            USDC: 'MATIC',
        },
        // Litecoin
        '76c802a2-7c88-447f-a93e-c29c9e5dd9c1': {
            default: 'LTC',
            LTC: 'LTC',
        },
        // EOS
        '6cfe566e-4aad-470b-8c9a-2fd35b49c68d': {
            default: 'EOS',
            EOS: 'EOS',
        },
        // Ripple
        '23dfb5a5-5d7b-48b6-905f-3970e3176e27': {
            default: 'XRP',
            XRP: 'XRP',
        },
        // Dogecoin
        '6770a1e5-6086-44d5-b60f-545f9d9e8ffd': {
            default: 'DOGE',
            DOGE: 'DOGE',
        },
        // Bitcoin Cash
        'fd11b6e3-0b87-41f1-a41f-f0e9b49e5bf0': {
            default: 'BCH',
            BCH: 'BCH',
        },
        // Solana
        '64692c23-8971-4cf4-84a7-4dd1271dd887': {
            default: 'SOL',
            SOL: 'SOL',
            USDT: 'SOL',
            USDC: 'SOL',
        },
        // Avalanche C-Chain
        'cbc77539-0a20-4666-8c8a-4ded62b36f0a': {
            default: 'AVAXC',
            AVAX: 'AVAXC',
            USDT: 'AVAXC',
            USDC: 'AVAXC',
        },
        // Arbitrum
        'd4fa2a7c-f1e8-4a7f-8ae8-2b3e5e6f8c4a': {
            default: 'ARBITRUM',
            ETH: 'ARBITRUM',
            USDT: 'ARBITRUM',
            USDC: 'ARBITRUM',
        },
        // Optimism
        'b0c82b1d-8c7e-4f5e-9a3f-1c2d3e4f5a6b': {
            default: 'OPTIMISM',
            ETH: 'OPTIMISM',
            USDT: 'OPTIMISM',
            USDC: 'OPTIMISM',
        },
    };

    // Symbol-based fallback for common tokens
    private readonly SYMBOL_NETWORK_FALLBACK: Record<string, string> = {
        BTC: 'BTC',
        ETH: 'ETH',
        USDT: 'ERC20', // Default to ERC20 for USDT
        USDC: 'ERC20',
        TRX: 'TRC20',
        BNB: 'BEP20',
        MATIC: 'MATIC',
        SOL: 'SOL',
        AVAX: 'AVAXC',
        LTC: 'LTC',
        DOGE: 'DOGE',
        XRP: 'XRP',
        BCH: 'BCH',
        EOS: 'EOS',
    };

    constructor(private readonly mixinClientService: MixinClientService) { }

    /**
     * Get CCXT network identifier for a Mixin asset
     * @param assetId Mixin asset ID (UUID)
     * @param symbol Asset symbol (e.g., 'USDT', 'BTC')
     * @returns CCXT network identifier (e.g., 'ERC20', 'TRC20', 'BTC')
     */
    async getNetworkForAsset(
        assetId: string,
        symbol: string,
    ): Promise<string> {
        try {
            // Check cache first
            let assetInfo = this.assetCache.get(assetId);

            if (!assetInfo) {
                // Fetch asset info from Mixin
                const client = this.mixinClientService.client;
                assetInfo = await client.network.fetchAsset(assetId);

                // Cache it
                this.assetCache.set(assetId, assetInfo);

                this.logger.log(
                    `Fetched asset info for ${symbol} (${assetId}): chain_id=${assetInfo.chain_id}`,
                );
            }

            const chainId = assetInfo.chain_id;

            // If asset is the chain itself (e.g., BTC, ETH)
            if (chainId === assetId) {
                const network = this.CHAIN_TO_NETWORK_MAP[chainId]?.default;
                if (network) {
                    this.logger.log(`Asset ${symbol} is native chain, using network: ${network}`);
                    return network;
                }
            }

            // Look up in chain mapping
            const chainMapping = this.CHAIN_TO_NETWORK_MAP[chainId];
            if (chainMapping) {
                // Try to find symbol-specific mapping
                const network = chainMapping[symbol] || chainMapping.default;
                this.logger.log(
                    `Mapped ${symbol} on chain ${chainId} to network: ${network}`,
                );
                return network;
            }

            // Fallback to symbol-based mapping
            const fallbackNetwork = this.SYMBOL_NETWORK_FALLBACK[symbol];
            if (fallbackNetwork) {
                this.logger.warn(
                    `Using fallback network for ${symbol}: ${fallbackNetwork}`,
                );
                return fallbackNetwork;
            }

            // Last resort: use symbol as network
            this.logger.warn(
                `No mapping found for ${symbol} (${assetId}, chain: ${chainId}), using symbol as network`,
            );
            return symbol;
        } catch (error) {
            this.logger.error(
                `Error getting network for asset ${symbol} (${assetId}): ${error.message}`,
            );

            // Fallback to symbol-based mapping
            const fallbackNetwork = this.SYMBOL_NETWORK_FALLBACK[symbol] || symbol;
            this.logger.warn(`Using fallback network: ${fallbackNetwork}`);
            return fallbackNetwork;
        }
    }

    /**
     * Get network for multiple assets in parallel
     */
    async getNetworksForAssets(
        assets: Array<{ assetId: string; symbol: string }>,
    ): Promise<Map<string, string>> {
        const results = await Promise.all(
            assets.map(async ({ assetId, symbol }) => ({
                assetId,
                network: await this.getNetworkForAsset(assetId, symbol),
            })),
        );

        return new Map(results.map((r) => [r.assetId, r.network]));
    }

    /**
     * Clear asset cache (useful for testing or when asset info changes)
     */
    clearCache(): void {
        this.assetCache.clear();
        this.logger.log('Asset cache cleared');
    }

    /**
     * Get cached asset info
     */
    getCachedAssetInfo(assetId: string): any {
        return this.assetCache.get(assetId);
    }
}
