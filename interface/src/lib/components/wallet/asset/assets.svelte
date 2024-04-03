<script lang="ts">
  import { userAssets } from "$lib/stores/wallet";
  import SingleAsset from "$lib/components/wallet/asset/singleAsset.svelte";
  import AssetDetailDialog from "$lib/components/dialogs/wallet/assetDetail.svelte";
</script>
<div class="flex flex-col px-5">
  {#if $userAssets}
    {#each Object.values($userAssets.balances) as asset}
      <SingleAsset {asset} />
    {/each}
  {/if}
</div>
<AssetDetailDialog />