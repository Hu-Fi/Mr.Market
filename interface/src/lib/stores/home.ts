import { writable } from "svelte/store";

export const mixinConnectLoading = writable(false)
export const mixinConnected = writable(false)
export const hideBalance = writable(false);
export const activeCoinTab = writable(0);

// For list sorting (change keys and 'sortCoins()' when data change)
export const asc = writable(true);
export const keys = ["market_cap_rank", "current_price", "price_change_percentage_24h"];
export const selectedField = writable(keys[0]);