<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { cleave } from "svelte-cleavejs";
  import { maskOption } from "$lib/helpers/constants";
  import { createNewAutoInvestAmounts, createNewAutoInvestAssets } from "$lib/stores/grow";
  import AssetIcon from "$lib/components/wallet/asset/assetIcon.svelte";
  import { findChainIcon } from "$lib/helpers/utils";
  
</script>

<div class="flex flex-col space-y-6">
  <div class="flex flex-col space-y-2">
    <span class="text-sm mx-2">
      {$_('period')} 
    </span>

    <div class="flex w-full px-2">
      <button class="btn btn-block no-animation">
        <span>
          { $_('select_period') }
        </span>
      </button>
    </div>
  </div>

  <div class="flex flex-col space-y-2">
    <span class="text-sm mx-2">
      {$_('unit')} 
    </span>

    <div class="flex w-full px-2">
      <button class="btn btn-block no-animation">
        <span>
          { $_('select_unit') }
        </span>
      </button>
    </div>
  </div>

  <div class="flex flex-col space-y-2">
    <span class="text-sm mx-2">
      {$_('amount')} 
    </span>

    {#each $createNewAutoInvestAssets as asset, i }
      <div class="flex items-center justify-between space-x-2 mx-2">
        <div class="flex space-x-2">
          <AssetIcon assetIcon={asset.icon_url} chainIcon={findChainIcon(asset.asset_id)} clazz="w-6 h-6" claxx="w-2 h-2" />
          <!-- <img src={asset.icon_url} alt="" class="w-6 h-6"> -->
          <span class="font-semibold">
            {asset.symbol}
          </span>
        </div>
        <div class="join border rounded-lg items-center">
          <input type="tel" use:cleave={maskOption} bind:value={$createNewAutoInvestAmounts[i]} class={clsx("input focus:border-none focus:outline-none w-32 join-item")} />
          <div class="join-item mr-2">
            <span class="text-sm opacity-60"> {'USDT'} </span>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>