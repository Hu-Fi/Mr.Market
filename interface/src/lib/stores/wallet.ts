import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";
import { AfterMixinOauth } from "$lib/helpers/mixin";
import { mixinConnected } from "./home";
import type { SpotOrder } from "$lib/types/hufi/spot";

export const user = writable()
export const userAssets = writable()
export const userSpotOrders:Writable<SpotOrder[]> = writable([])
export const userSpotOrdersLoaded = writable(false)
export const userStrategyOrders: Writable<unknown> = writable({})
export const userArbitrageOrders = writable([])
export const userMarketMakingOrders = writable([])
export const userStrategyOrdersLoaded = writable(false)
export const topAssetsCache = writable({})
export const currencySymbol = writable("$")
export const assetDetailAsset = writable()
export const assetDetailDialog = writable()

export const checkMixinTokenExist = () => {
  if (!localStorage.getItem('mixin-oauth')) {
    localStorage.removeItem('mixin-oauth');
    mixinConnected.set(false);
    return false;
  } else {
    return true;
  }
};

export const autoConnectMixin = async () => {
  if (!browser) return;
  let token = localStorage.getItem('mixin-oauth')
  try {
    token = token.replace(/\n/g, '');
  } catch (e) {
    console.error('autoConnectMixin:', e)
  }

  await AfterMixinOauth(token)
}