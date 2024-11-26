<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onDestroy } from "svelte";
  import { findCoinIconBySymbol, findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import {
    createArbPair,
    createMMEasyAmounts,
    createArbConfirmDialog,
    createArbExchange1,
    createArbPairSearch,
    createArbExchange2,
  } from "$lib/stores/grow";
    import AssetIcon from "$lib/components/common/assetIcon.svelte";

  $: baseAssetSymbol = $createArbPair ? $createArbPair.base_symbol : ''
  $: targetAssetSymbol = $createArbPair ? $createArbPair.target_symbol : ''

  onDestroy(() => {
    createArbPair.set(undefined);
    createMMEasyAmounts.set([]);
    createArbConfirmDialog.set(false);
    createArbPairSearch.set('');
  });
</script>

<div class="grid grid-cols-2 bg-slate-50 p-4 mt-4">
  <!-- Exchange -->
  <div class="flex flex-col space-y-4 mx-2 border p-4 rounded-lg bg-base-100">
    <div class="flex justify-between">
      <span class="text-sm capitalize">
        {$_("exchange")}
      </span>
    </div>

    <div class="flex space-x-2 truncate">
      <div class="flex items-center space-x-0.5">
        <div class="avatar">
          <div class="mask mask-squircle w-6 h-6">
            <img
              src={findExchangeIconByIdentifier($createArbExchange1)}
              alt=""
              class=""
            />
          </div>
        </div>

        <div class="avatar">
          <div class="mask mask-squircle w-6 h-6">
            <img
              src={findExchangeIconByIdentifier($createArbExchange2)}
              alt=""
              class=""
            />
          </div>
        </div>
      </div>  

      <div class="flex items-center space-x text-sm">
        <span class="font-semibold capitalize">
          {$createArbExchange1}
        </span>
        /
        <span class="font-semibold capitalize">
          {$createArbExchange2}
        </span>
      </div>
    </div>
  </div>

  <!-- Pair -->
  <div class="flex flex-col space-y-4 mx-2 border p-4 rounded-lg bg-base-100">
    <div class="flex justify-between">
      <span class="text-sm">
        {$_("pair")}
      </span>
    </div>

    <div class="flex items-center space-x-2">
      <div class="flex -space-x-2">
        <div class="avatar">
          <div class="mask mask-squircle w-5 h-5">
            <AssetIcon assetIcon={findCoinIconBySymbol(baseAssetSymbol)} clazz="w-5 h-5" claxx="w-2 h-2" />
          </div>
        </div>
        <div class="avatar">
          <div class="mask mask-squircle w-5 h-5">
            <AssetIcon assetIcon={findCoinIconBySymbol(targetAssetSymbol)} clazz="w-5 h-5" claxx="w-2 h-2" />
          </div>
        </div>
      </div>
      <span class="font-semibold text-sm text-nowrap">
        {$createArbPair ? baseAssetSymbol + "/" + targetAssetSymbol : ''}
      </span>
    </div>
  </div>
</div>
