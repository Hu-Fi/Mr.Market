<script lang="ts">
  import { page } from "$app/stores";
  import ArbCard from "../arbitrage/card.svelte";
  import MMCard from "../marketMaking/card.svelte";
  // import AICard from "../autoInvest/card.svelte";
  import Create from "$lib/components/grow/elements/create.svelte";
  import AddMore from "$lib/components/grow/elements/addMore.svelte";
  import { userArbitrageOrders, userMarketMakingOrders, userStrategyOrders } from "$lib/stores/wallet";
</script>

{#if $userStrategyOrders.total === 0}
  <Create />
{:else}
  <div class="flex flex-col space-y-4 mx-4 mt-6 mb-24">
    {#each $userArbitrageOrders as item}
      <ArbCard data={item} />
    {/each}
    {#each $userMarketMakingOrders as item}
      <MMCard data={item} />
    {/each}
    <!-- {#each orders.auto_invest as item}
      <AICard data={item} />
    {/each} -->

    <AddMore />
  </div>
{/if}
