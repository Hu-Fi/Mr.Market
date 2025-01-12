import type { AdminSingleKey } from "$lib/types/hufi/admin";
import { writable } from "svelte/store";

export const submitted = writable(false);
export const checked = writable(false);
export const correct = writable(false);
export const loginLoading = writable(false);

// /manage/rebalance
export const balances = writable()
export const balancesLoading = writable(false)
export const balancesLoaded = writable(false)

export const exchangeApiKeys = writable<AdminSingleKey[]>([])
export const exchangeApiKeysLoading = writable(true)

// /manage/rebalance/withdraw/exchange/[id]/[currency]
export const withdrawBalances = writable<{name: string, amount: number}[]>([])
