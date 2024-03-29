import { get, writable } from "svelte/store";
import MixinChains from "$lib/constants/mixinChains.json"

export const Input = writable()
export const Output = writable()
export const InputAsset = writable(MixinChains[8])
export const OutputAsset = writable(MixinChains[9])
export const InputAssetDialog = writable(false)
export const InputAssetSearch = writable('')
export const OutputAssetDialog = writable(false)
export const OutputAssetSearch = writable('')
export const InputBalanceAccount = writable({})
export const InputBalanceDialog = writable(false)
export const OutputBalanceAccount = writable({})
export const OutputBalanceDialog = writable(false)
export const SwapConfirmDialog = writable(false)
export const SupportedExchangesDialog = writable(false)
export const SwitchInputOutput = () => {
  const i = get(InputAsset)
  InputAsset.set(get(OutputAsset))
  OutputAsset.set(i)
  Input.set('')
  Output.set('')
}