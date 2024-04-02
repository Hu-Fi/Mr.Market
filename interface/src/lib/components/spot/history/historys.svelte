<script>
  import { _ } from "svelte-i18n";
  import { mixinConnected } from "$lib/stores/home";
  import ConnectWalletBtn from "$lib/components/common/connectWalletBtn.svelte";
  import SingleSpotHistory from "$lib/components/spot/history/singleSpotHistory.svelte";
</script>

{#if $mixinConnected}
  <div class="mx-6 flex flex-col space-y-3">
    {#each Array(10) as _}
      <SingleSpotHistory />
    {/each}
  </div>
{:else}
  <div class="flex flex-col h-[90vh] items-center justify-center space-y-6">
    <span class="text-sm opacity-80">
      {$_("connect_wallet_order_intro")}
    </span>
    <ConnectWalletBtn clazz="" />
  </div>
{/if}
