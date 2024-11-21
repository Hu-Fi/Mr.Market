<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { onDestroy } from "svelte";
	import { cleave } from 'svelte-cleavejs';
  import { maskOption } from "$lib/helpers/constants";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import { createJustGrowAmount, createJustGrowAsset } from "$lib/stores/grow";

  onDestroy(() => {
    createJustGrowAmount.set({ key: '', value: '' });
  })
</script>

<div class="flex flex-col space-y-2 mx-4">
  <div class="flex justify-between mx-2">
    <span class="text-sm">
      {$_('amount')} 
    </span>
  </div>
  
  <div class="flex items-center justify-between space-x-2 mx-2">
    <div class="flex space-x-2 items-center">
      <AssetIcon assetIcon={findCoinIconBySymbol($createJustGrowAsset.symbol) || $createJustGrowAsset.icon_url} clazz="w-8 h-8" claxx="w-2 h-2" />
      <span class="font-semibold text-sm">
        {$createJustGrowAsset ? $createJustGrowAsset.symbol : ''}
      </span>
    </div>

    <div class="join border rounded-lg items-center">
      <input type="text" use:cleave={maskOption} data-testid="amount-input-0" bind:value={$createJustGrowAmount} class={clsx("input focus:border-none focus:outline-none w-36 join-item pr-0 placeholder:text-base-content/40")} placeholder={$_('enter_amount')} />
      <div class="join-item mr-2 w-14 text-end truncate">
        <span class="text-sm opacity-40"> {$createJustGrowAsset ? $createJustGrowAsset.symbol : ''} </span>
      </div>
    </div>
  </div>
</div>