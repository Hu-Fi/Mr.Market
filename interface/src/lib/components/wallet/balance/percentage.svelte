<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { userAssets } from "$lib/stores/wallet";
  import { formatDecimals, getAssetPercentage } from "$lib/helpers/utils";
  
  $: first = $userAssets ? getAssetPercentage($userAssets.balances[0].usdBalance, $userAssets.totalUSDBalance) : 0
  $: second = $userAssets ? getAssetPercentage($userAssets.balances[1].usdBalance, $userAssets.totalUSDBalance) : 0
  $: percentages = $userAssets ? [
    first,
    second,
    formatDecimals(100-first-second, 1),
  ]: [63, 21, 16];
  const assetList = [ 
    { symbol: $userAssets.balances[0].details.symbol},
    { symbol: $userAssets.balances[1].details.symbol},
    { symbol: $_('other')}
  ]
  const colorList = [ "bg-blue-500", "bg-purple-500", "bg-yellow-500" ]
</script>

<div class="flex flex-col space-y-4">
  {#if $userAssets}
    <!-- Line -->
    <div class="mx-4 shadow-2xl flex join-item">
      <div
        class={clsx("fst","from-blue-400 to-blue-600 bg-gradient-to-r h-1 rounded-l-2xl")}
        style="--1st-line-percentage: {percentages[0] + '%'}"
      />
      <div
        class={clsx("snd", "from-sky-500 to-purple-600 bg-gradient-to-r h-1 rounded-none ")}
        style="--2nd-line-percentage: {percentages[1] + '%'}"
      />
      <div
        class={clsx("trd", "from-yellow-500 to-yellow-600 bg-gradient-to-r h-1 rounded-r-2xl")}
        style="--3rd-line-percentage: {percentages[2] + '%'}"
      />
    </div>

    <!-- Text -->
    <div class="grid grid-cols-3 gap-4 content-center px-4">
      {#each assetList as a, i}
        <div class="flex items-center justify-center space-x-2">
          <div class={clsx("h-2 w-0.5 rounded-full", colorList[i])} />

          <span class="text-xs opacity-40 !ml-1">
            {a.symbol}
          </span>
          
          <span class="text-xs opacity-40">
            {percentages[i]}%
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .fst {
    width: var(--1st-line-percentage);
  }
  .snd {
    width: var(--2nd-line-percentage);
  }
  .trd {
    width: var(--3rd-line-percentage);
  }
</style>
