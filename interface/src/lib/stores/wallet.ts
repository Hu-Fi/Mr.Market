import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { AfterMixinOauth } from "$lib/helpers/mixin";
import { mixinConnected } from "./home";

export let user = writable()
export let userAssets = writable()
export let topAssetsCache = writable({})
export let currencySymbol = writable("$")
export let assetDetailAsset = writable()
export let assetDetailDialog = writable()

export const checkMixinTokenExist = () => {
  if (!localStorage.getItem('mixin-oauth')) {
    console.log('!token, remove mixin-oauth');
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
    token = JSON.parse(token)
    token = token.replace(/\n/g, '');
  } catch (e) {
    console.error('autoConnectMixin:', e)
  }

  await AfterMixinOauth(token)
}