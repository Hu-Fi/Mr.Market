import { writable } from "svelte/store";

export let Input = writable()
export let Output = writable()
export let InputAssetDialog = writable(false)
export let OutputAssetDialog = writable(false)
export let InputBalanceAccount = writable('trading')