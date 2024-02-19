<script lang="ts">
  import { findChainIcon } from "$lib/helpers/utils";
  import type { MixinAsset } from "$lib/types/common/asset";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";

  export let asset: MixinAsset;
  export let fn: () => void;
  export let showBalance = false;
  export let testid: string;
</script>

<button class="flex space-x-3.5 py-4 items-center" on:click={() => fn()} data-testid={`swap-asset-${testid}`}>
  <!-- Icon -->
  <AssetIcon
    assetIcon={asset.icon_url}
    chainIcon={findChainIcon(asset.chain_id)}
    clazz="w-8 h-8"
    claxx="w-3 h-3"
  />

  <!-- Symbol and Name -->
  <div class="flex flex-col justify-center items-start">
    <span class="font-semibold text-sm"> {asset.symbol} </span>
    <span class="text-xs font-light opacity-60"> {asset.name} </span>
  </div>

  <!-- Balance -->
  {#if showBalance}
    <div>
      <span></span>
    </div>
  {/if}
</button>
