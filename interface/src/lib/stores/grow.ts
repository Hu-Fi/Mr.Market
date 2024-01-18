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

// Add more dialog
export let addMoreDialog = writable(false)