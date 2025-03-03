<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { cleave } from "svelte-cleavejs";
  import { findChainIcon } from "$lib/helpers/utils";
  import { maskOption } from "$lib/helpers/constants";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import { createAIAmounts, createAIName, createAIAssets, createAIPeriodDialog, createAISelectUnitDialog, createAIAutoPay, createAIFiat, createAIPeriod } from "$lib/stores/grow";

  const getPeriodByNumber = (n: number) => {
    switch(n){
      case 24: return $_("daily")
      case 7*24: return $_("weekly") 
      case 30*24: return $_("monthly")
    }
  }

  if ($createAIAssets.length === 0) goto('/grow/auto_invest/new/one')
</script>

<div class="flex flex-col space-y-8">
  <div class="flex flex-col space-y-2 mx-2">
    <span class="text-sm">
      {$_('name')}
    </span>
  
    <input class="input border-base-300 focus:outline-none" placeholder={$_('enter_name')} bind:value={$createAIName} />
  </div>

  <div class="flex flex-col space-y-2">
    <span class="text-sm mx-2">
      {$_('period')} 
    </span>

    <div class="flex w-full px-2">
      <button class="btn btn-block justify-between bg-base-100 border-base-300 no-animation" on:click={()=>{createAIPeriodDialog.set(!$createAIPeriodDialog)}}>
        <span class={clsx('font-medium', $createAIPeriod ? "" : "opacity-40")}>
          { $createAIPeriod ? getPeriodByNumber($createAIPeriod) : $_('select_period') }
        </span>
        {#if !$createAIPeriodDialog}
          <!-- Caret down Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="opacity-40 h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill="currentColor"></path></svg>
        {:else}
          <!-- Caret up Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="opacity-40 h-4 w-4"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill="currentColor"></path></svg>
        {/if}
      </button>
    </div>
  </div>

  <div class="flex flex-col space-y-2">
    <div class="flex justify-between mx-2">
      <span class="text-sm">
        {$_('amount')} 
      </span>

      <button class="flex items-center" on:click={()=>{createAISelectUnitDialog.set(!$createAISelectUnitDialog)}}>
        <span class="text-xs opacity-60">
          {$_("select_unit")}
        </span>
        {#if !$createAISelectUnitDialog}
          <!-- Caret down Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="h-4 w-4 opacity-60"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill="currentColor"></path></svg>
        {:else}
          <!-- Caret up Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="h-4 w-4 opacity-60"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill="currentColor"></path></svg>
        {/if}
      </button>
    </div>

    {#each $createAIAssets as asset, i }
      <div class="flex items-center justify-between space-x-2 mx-2">
        <div class="flex space-x-2">
          <AssetIcon assetIcon={asset.icon_url} chainIcon={findChainIcon(asset.chain_id)} clazz="w-6 h-6" claxx="w-2 h-2" />
          <span class="font-semibold">
            {asset.symbol}
          </span>
        </div>
        <div class="join border rounded-lg items-center">
          <input type="text" inputmode="decimal" use:cleave={maskOption} bind:value={$createAIAmounts[i]} class={clsx("input focus:border-none focus:outline-none w-32 join-item")} />
          <div class="join-item mr-2">
            <span class="text-sm opacity-60"> {$createAIFiat} </span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="flex items-center space-y-4">
    <div class="flex justify-between items-center w-full">
      <div class="flex flex-col space-y-2">
        <span class="text-sm mx-2">
          {$_("pay_automatically")}
        </span>
        <span class="text-xs mx-2 opacity-60">
          {$_("pay_automatically_intro")}
        </span>  
      </div>
      <input type="checkbox" class="toggle mx-2" bind:checked={$createAIAutoPay} />
    </div>
  </div>
</div>