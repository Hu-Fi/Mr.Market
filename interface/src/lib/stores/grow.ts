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
export let createAIPeriod = writable([])
export let createAIName = writable('')
export let createAIPeriodDialog = writable(false)
export let createAISelectUnitDialog = writable(false)