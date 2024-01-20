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
export let selectAssetDialog = writable(false)
export let selectAssetSearch = writable("")
// 0 = select asset, 1 == amount and period, 2 == name and auto
export let createNewAutoInvestStep = writable(0)
export let createNewAutoInvestAssets = writable([])
export let createNewAutoInvestAmounts = writable([])
export let createNewAutoInvestPeriod = writable([])
export let createNewAutoInvestName = writable('')