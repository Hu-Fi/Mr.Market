import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";
import { AfterMixinOauth } from "$lib/helpers/mixin/mixin";
import { mixinConnected } from "./home";
import type { SpotOrder } from "$lib/types/hufi/spot";
import type { UserAssets } from "$lib/types/hufi/wallet";
import type { UserResponse } from "@mixin.dev/mixin-node-sdk";

export const user = writable<UserResponse>()
export const userAssets: Writable<UserAssets> = writable()
export const userSpotOrders: Writable<SpotOrder[]> = writable([])
export const userSpotOrdersLoaded = writable(false)
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