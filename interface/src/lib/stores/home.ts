import { writable, readable } from "svelte/store";
import { isIOS } from "$lib/helpers/mixin";

export const mixinConnectLoading = writable(false)
export const mixinConnected = writable(false)
export const hideBalance = writable(false);
export const activeCoinTab = writable(0);

// For list sorting (change keys and 'sortCoins()' when data change)
export const asc = writable(true);
export const keys = ["market_cap_rank", "current_price", "price_change_percentage_24h"];
export const selectedField = writable(keys[0]);

// In iOS, the bottom navigation bar is higher
export const isMixinIOS = readable(false, set => {
  set(isIOS());
});