<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import Config from "$lib/components/admin/settings/config/config.svelte";
  import Exchanges from "$lib/components/admin/settings/exchanges/exchanges.svelte";
  import Arbitrage from "$lib/components/admin/settings/arbitrage/arbitrage.svelte";
  import SimplyGrow from "$lib/components/admin/settings/simplyGrow/simplyGrow.svelte";
  import SpotTrading from "$lib/components/admin/settings/spotTrading/spotTrading.svelte";
  import MarketMaking from "$lib/components/admin/settings/marketMaking/marketMaking.svelte";

  let modes = ["exchanges", "spot_trading", "arbitrage", "market_making", "simply_grow"];
  let mode = "exchanges";
</script>

<div class="p-8">
  <div class="flex flex-col space-y-4 items-start mb-8">
    <ul class="flex flex-row outline outline-1 outline-base-content/20 rounded-full gap-2 p-1">
      {#each modes as m}
        <li>
          <button class={clsx("relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors", "text-foreground/80 hover:text-base-content", mode === m && "bg-muted text-base-content bg-base-200")} on:click={() => mode = m}>
            <span>
              {$_(m)}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </div>
  
  {#if mode === "config"}
    <Config />
  {:else if mode === "spot_trading"}
    <SpotTrading />
  {:else if mode === "exchanges"}
    <Exchanges />
  {:else if mode === "arbitrage"}
    <Arbitrage />
  {:else if mode === "market_making"}
    <MarketMaking />
  {:else if mode === "simply_grow"} 
    <SimplyGrow />
  {/if}
</div>