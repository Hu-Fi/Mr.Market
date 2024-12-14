import { writable } from "svelte/store";

export const submitted = writable(false);
export const checked = writable(false);
export const correct = writable(false);
export const loginLoading = writable(false);

// /manage/user
export const userSearch = writable('')

// /manage/rebalance
export const balances = writable()
export const balancesLoading = writable(false)
