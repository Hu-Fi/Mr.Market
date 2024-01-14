<script lang="ts">
	import WalletTitleLoader from '$lib/components/skeleton/wallet//walletTitleLoader.svelte';
	import SingleAssetLoader from '$lib/components/skeleton/wallet//singleAssetLoader.svelte';
	import WalletPercentLoader from '$lib/components/skeleton/wallet/walletPercentLoader.svelte';
</script>

<div class="flex flex-col space-y-8">
  <div class="flex flex-col space-y-4">
    <WalletTitleLoader />
    <WalletPercentLoader />
  </div>
  <div class="flex flex-col px-5">
    {#each Array(10) as a}
      <SingleAssetLoader />
    {/each}
  </div>
</div>