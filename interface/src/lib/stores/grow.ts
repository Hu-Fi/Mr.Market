import { page } from "$app/stores";
import { derived } from 'svelte/store';
import { growPathChecker } from "$lib/helpers/helpers";
import { writable, type Writable } from "svelte/store";
import type { ArbitragePair, MarketMakingPair, SimplyGrowToken } from "$lib/types/hufi/grow";

// 0 easy, 1 advanced
export const easyAdvancedMode = writable(0)

export const mmCoin0 = writable()
export const mmCoin1 = writable()
export const addMoreDialog = writable(false)

export const currentArbitrageStatus = writable()
export const currentMarketMakingStatus = writable()

// Create new arbitrage
export const createArbConfirmDialog = writable(false)
export const editArbitrageDialog = writable(false)
export const selectArbExchange1Dialog = writable(false)
export const selectArbExchange2Dialog = writable(false)
export const createArbExchange1: Writable<string> = writable()
export const createArbExchange2: Writable<string> = writable()
export const createArbExchange1Search = writable('')
export const createArbExchange2Search = writable('')
export const createArbPair: Writable<ArbitragePair> = writable()
export const createArbPairSearch: Writable<string> = writable('')
export const createArbAmount = writable([])

// Create new just grow
export const createSimplyGrowAsset = writable<SimplyGrowToken>()
export const createSimplyGrowAmount = writable<string>()
export const createSimplyGrowLockTime = writable({ key: '', value: '' })
export const createSimplyGrowLockTimeDialog = writable(false)
export const createSimplyGrowConfirmDialog = writable(false)
export const createSimplyGrowSearch = writable('')
export const createSimplyGrowRewardAddressDialog = writable(false)
export const createSimplyGrowRewardAddress = writable('')

// Create new auto invest
export const createAISelectAssetSearch = writable("")
// 0 = select asset, 1 == amount and period, 2 == name and auto
export const createAIStep = writable(0)
export const createAIAssets = writable([])
export const createAIAmounts = writable([])
// from 60 minutes to 12 months, base: 1 hour, default: 24 hour
export const createAIPeriod = writable(24)
export const createAIName = writable('')
export const createAIFiat = writable('USDT')
export const createAIAutoPay = writable(true)
export const createAIPeriodDialog = writable(false)
export const createAISelectUnitDialog = writable(false)

export const isArbitragePage = derived(page, $page => growPathChecker($page, 'arbitrage'));
export const isMarketMakingPage = derived(page, $page => growPathChecker($page, 'market_making'));
export const isSimplyGrowPage = derived(page, $page => growPathChecker($page, 'simply_grow'))