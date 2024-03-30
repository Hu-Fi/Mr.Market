import { writable } from "svelte/store";

// 0 easy, 1 advanced
export const easyAdvancedMode = writable(0)

export const mmCoin0 = writable()
export const mmCoin1 = writable()
// 0 asset, 1 amount
export const mmEasyStep = writable(0)

export const arbEasyStep = writable(0)
export const currentArbitrageStatus = writable()
export const currentMarketMakingStatus = writable()
export const editArbitrageDialog = writable(false)
export const editMarketMakingDialog = writable(false)

export const addMoreDialog = writable(false)

// Create new market making
export const createMMConfirmDialog = writable(false)
export const createMMEasyPair = writable()
export const createMMEasyAmounts = writable([])
export const createMMSelectPairEasyFilter = writable('')
export const createMMSelectPairEasySearch = writable('')

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