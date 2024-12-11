<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import Config from "$lib/components/admin/settings/config/config.svelte";
  import Exchanges from "$lib/components/admin/settings/exchanges/exchanges.svelte";
  import Arbitrage from "$lib/components/admin/settings/arbitrage/arbitrage.svelte";
  import SimplyGrow from "$lib/components/admin/settings/simplyGrow/simplyGrow.svelte";
  import SpotTrading from "$lib/components/admin/settings/spotTrading/spotTrading.svelte";
  import MarketMaking from "$lib/components/admin/settings/marketMaking/marketMaking.svelte";

  let modes = ["config", "spot_trading", "exchanges", "arbitrage", "market_making", "simply_grow"];
  let mode = "config";
</script>

<div class="p-8">
  <div class="flex flex-col space-y-4 items-start mb-8">
    <div class="flex flex-row space-x-8">
      <ul class="menu menu-vertical lg:menu-horizontal lg:w-full outline outline-1 outline-base-content/20 rounded-md gap-2">
        {#each modes as m}
          <li>
            <button class={clsx("btn btn-sm btn-ghost rounded-md no-animation", mode === m && "bg-base-300")} on:click={() => mode = m}>
              <span class="text-base">
                {$_(m)}
              </span>
            </button>
          </li>
        {/each}
      </ul>
    </div>
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