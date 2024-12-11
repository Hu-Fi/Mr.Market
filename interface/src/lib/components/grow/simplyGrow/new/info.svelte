<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onDestroy } from "svelte";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import {
    createSimplyGrowAmount,
    createSimplyGrowAsset,
    createSimplyGrowSearch,
  } from "$lib/stores/grow";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";

  onDestroy(() => {
    createSimplyGrowAsset.set({});
    createSimplyGrowAmount.set('');
    createSimplyGrowSearch.set("");
    createSimplyGrowAsset.set({});
  });
</script>

<div class="grid grid-cols-2 bg-slate-50 p-4 mt-4">
  <!-- Token -->
  <div class="flex flex-col space-y-4 mx-2 border p-4 rounded-lg bg-base-100">
    <div class="flex justify-between">
      <span class="text-sm">
        {$_("token")}
      </span>
    </div>

    <div class="flex items-center space-x-2">
      <div class="avatar">
        <div class="mask mask-squircle w-5 h-5">
          <AssetIcon assetIcon={findCoinIconBySymbol($createSimplyGrowAsset.symbol) || $createSimplyGrowAsset.icon_url} clazz="w-5 h-5" claxx="w-2 h-2" />
        </div>
      </div>
      <span class="font-semibold text-sm text-nowrap">
        {$createSimplyGrowAsset.symbol}
      </span>
    </div>
  </div>

  <!-- APY -->
  <div class="flex flex-col space-y-4 mx-2 border p-4 rounded-lg bg-base-100">
    <div class="flex justify-between">
      <span class="text-sm capitalize">
        {$_("apy")}
      </span>
    </div>

    <div class="flex items-center space-x-2">
      <span class="font-semibold">
        {'-'}
      </span>
    </div>
  </div>  
</div>
