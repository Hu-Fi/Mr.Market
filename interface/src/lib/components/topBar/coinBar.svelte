<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from '$app/stores'
  import { goto } from "$app/navigation";
  import { mixinShare } from "$lib/helpers/mixin";
  import { AppName } from "$lib/helpers/constants";
  import MixinMenu from "../common/MixinMenu.svelte";
  import { ChartActiveTab, currentCoin } from "$lib/stores/market";
  
  let like = false
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px]">
  <button class="" on:click={()=>{ ChartActiveTab.set(1); history.back(); if(!history.length) goto('/market') }}>
    <!-- Chevron left Icon -->
    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>    
  </button>

  <div class="flex items-center space-x-4">
    <!-- Favorite -->
    <button on:click={()=>{like = !like}}>
      <!-- Star Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class={clsx("w-5 h-5", like ? 'fill-yellow-300 stroke-yellow-300':'stroke-base-content/80')} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
    </button>

    <button class="" on:click={()=>{mixinShare($page.url.pathname, $_('coin_market', {values:{symbol:$currentCoin.symbol.toUpperCase()}}), AppName, $currentCoin.image.thumb)}}>
      <!-- Arrow up on square Icon -->
      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" /></svg>      
    </button>

    <MixinMenu />
  </div>
</div>
