import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { AfterMixinOauth, mixinUserMe } from "$lib/helpers/mixin";
import { mixinConnected } from "./home";

export let user = writable()
export let userAssets = writable()
export let topAssetsCache = writable({})
export let currencySymbol = writable("$")
export let assetDetailAsset = writable()
export let assetDetailDialog = writable()

export const autoConnectMixin = async () => {
  if (!browser) return;
  let token = localStorage.getItem('mixin-oauth')
  if (!localStorage.getItem('mixin-oauth')) {
    console.log('!token, remove mixin-oauth')
    localStorage.removeItem('mixin-oauth')
    mixinConnected.set(false)
    return
  }
  try {
    token = JSON.parse(token)
    token = token.replace(/\n/g, '');
  } catch (e) {}
  const data = await mixinUserMe(token)
  if (!data) {
    console.log('!UserMe, remove mixin-oauth')
    localStorage.removeItem('mixin-oauth')
    return
  }
  if (data.full_name === '') {
    console.log('!UserMeError, remove mixin-oauth')
    localStorage.removeItem('mixin-oauth')
    return
  }
  AfterMixinOauth(token)
}