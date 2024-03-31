<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { onDestroy } from "svelte";
	import { cleave } from 'svelte-cleavejs';
  import { maskOption } from "$lib/helpers/constants";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import { createMMEasyAmounts, createMMEasyPair } from "$lib/stores/grow";

  $: baseAssetSymbol = $createMMEasyPair.symbol.split("/")[0] || ''
  $: targetAssetSymbol = $createMMEasyPair.symbol.split("/")[1] || ''

  onDestroy(() => {
    createMMEasyAmounts.set([]);
  })
</script>

<div class="flex flex-col space-y-2">
  <div class="flex justify-between mx-2">
    <span class="text-sm">
      {$_('amount')} 
    </span>
  </div>
  
  <div class="flex items-center justify-between space-x-2 mx-2">
    <div class="flex space-x-2">
      <AssetIcon assetIcon={findCoinIconBySymbol(baseAssetSymbol)} clazz="w-6 h-6" claxx="w-2 h-2" />
      <span class="font-semibold">
        {baseAssetSymbol}
      </span>
    </div>

    <div class="join border rounded-lg items-center">
      <input type="tel" use:cleave={maskOption} bind:value={$createMMEasyAmounts[0]} class={clsx("input focus:border-none focus:outline-none w-32 join-item")} />
      <div class="join-item mr-2 w-12 text-end">
        <span class="text-sm opacity-60"> {baseAssetSymbol} </span>
      </div>
    </div>
  </div>
  
  <div class="flex items-center justify-between space-x-2 mx-2">
    <div class="flex space-x-2">
      <AssetIcon assetIcon={findCoinIconBySymbol(targetAssetSymbol)} clazz="w-6 h-6" claxx="w-2 h-2" />
      <span class="font-semibold">
        {targetAssetSymbol}
      </span>
    </div>

    <div class="join border rounded-lg items-center">
      <input type="tel" use:cleave={maskOption} bind:value={$createMMEasyAmounts[1]} class={clsx("input focus:border-none focus:outline-none w-32 join-item")} />
      <div class="join-item mr-2 w-12 text-end">
        <span class="text-sm opacity-60"> {targetAssetSymbol} </span>
      </div>
    </div>
  </div>
</div>