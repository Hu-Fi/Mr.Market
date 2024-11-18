<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onDestroy } from "svelte";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import {
    createJustGrowAmount,
    createJustGrowAsset,
    createJustGrowSearch,
  } from "$lib/stores/grow";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";

  onDestroy(() => {
    createJustGrowAsset.set({});
    createJustGrowAmount.set('');
    createJustGrowSearch.set("");
    createJustGrowAsset.set({});
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
          <AssetIcon assetIcon={findCoinIconBySymbol($createJustGrowAsset.symbol)} clazz="w-5 h-5" claxx="w-2 h-2" />
        </div>
      </div>
      <span class="font-semibold text-sm text-nowrap">
        {$createJustGrowAsset.symbol}
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
