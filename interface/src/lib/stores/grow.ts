import { writable } from "svelte/store";

// 0 easy, 1 advanced
export let easyAdvancedMode = writable(0)

// MarketMaking
export let mmCoin0 = writable()
export let mmCoin1 = writable()
export let mmCoinSelector = writable(false)
// 0 asset, 1 amount
export let mmEasyStep = writable(0)

// Arbitrage
export let arbEasyStep = writable(0)

export let addMoreDialog = writable(false)

// Create new auto invest
export let createAISelectAssetSearch = writable("")
// 0 = select asset, 1 == amount and period, 2 == name and auto
export let createAIStep = writable(0)
export let createAIAssets = writable([])
export let createAIAmounts = writable([])
// from 60 minutes to 12 months, base: 1 hour, default: 24 hour
export let createAIPeriod = writable(24)
export let createAIName = writable('')
export let createAIFiat = writable('USDT')
export let createAIAutoPay = writable(true)
export let createAIPeriodDialog = writable(false)
export let createAISelectUnitDialog = writable(false)