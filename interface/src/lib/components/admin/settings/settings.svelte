<script>
  import { _ } from "svelte-i18n";
  import Constants from "$lib/components/admin/settings/constants/constants.svelte";
  import Arbitrage from "$lib/components/admin/settings/arbitrage/arbitrage.svelte";
  import MarketMaking from "$lib/components/admin/settings/marketMaking/marketMaking.svelte";
  import SimplyGrow from "$lib/components/admin/settings/simplyGrow/simplyGrow.svelte";

  let modes = ["constants", "arbitrage", "market_making", "simply_grow"];
  let mode = "all";
</script>

{#if mode != "all"}
  <div class="space-y-8">
    <button class="btn btn-sm rounded-2xl" on:click={() => mode = "all"}> {$_("back")} </button>
  </div>
{/if}
{#if mode === "all"}
  <div class="flex flex-col space-y-8">
    <div class="flex flex-row space-x-4">
      {#each modes as m}
        <button class="btn btn-sm rounded-2xl" on:click={() => mode = m}> {$_(m)} </button>
      {/each}
    </div>
  </div>
{:else if mode === "constants"}
  <Constants />
{:else if mode === "arbitrage"}
  <Arbitrage />
{:else if mode === "market_making"}
  <MarketMaking />
{:else if mode === "simply_grow"} 
  <SimplyGrow />
{/if}