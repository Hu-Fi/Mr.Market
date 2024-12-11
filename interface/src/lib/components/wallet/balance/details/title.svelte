<script lang="ts">
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import {
    BN2,
    findChainIcon,
    formatDecimals,
  } from "$lib/helpers/utils";
  import { assetDetailAsset } from "$lib/stores/wallet";
  let locale_currency = 1;
</script>

<!-- Asset balance -->
<button
class="flex justify-between px-4 !mt-4 w-full"
on:click={() => {}}
>
<div class="flex space-x-4 items-center mx-3">
  <!-- Left Icon -->
  <AssetIcon
    clazz="w-12 h-12"
    claxx="w-4 h-4"
    assetIcon={$assetDetailAsset.details.icon_url}
    chainIcon={findChainIcon($assetDetailAsset.details.chain_id)}
  />

  <!-- Center Amount and USD Value -->
  <div class="flex flex-col space-y-0.5 items-start">
    <div>
      <span class="balance-font text-3xl select-text"
        >{formatDecimals($assetDetailAsset.balance, 8)}</span
      >
      <span class="text-xs">{$assetDetailAsset.details.symbol}</span>
    </div>

    <span class="text-xs opacity-40"
      >≈ ${formatDecimals(
        BN2($assetDetailAsset.balance)
          .multipliedBy($assetDetailAsset.details.price_usd)
          .multipliedBy(locale_currency)
          .toNumber(),
        2,
      )}</span
    >
  </div>
</div>
</button>