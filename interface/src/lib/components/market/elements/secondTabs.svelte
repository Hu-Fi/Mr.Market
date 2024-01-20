<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { darkTheme } from "$lib/stores/theme";  
  import { activeSecondTab, activeTab } from "$lib/stores/market";

  let coinItems = [
    {name: $_("favorites"), fn: ()=>{}},
    {name: $_("all"), fn: ()=>{}},
    {name: $_("mainstream"), fn: ()=>{}},
    {name: $_("layer1"), fn: ()=>{}},
    {name: $_("layer2"), fn: ()=>{}},
    {name: $_("inscription"), fn: ()=>{}},
    {name: $_("ai"), fn: ()=>{}},
    {name: $_("meme"), fn: ()=>{}},
    {name: $_("defi"), fn: ()=>{}},
    {name: $_("game_fi"), fn: ()=>{}},
    {name: $_("nft"), fn: ()=>{}},
  ]

  let spotItems = [
    {name: $_("all"), fn: ()=>{}},
    {name: $_("binance"), fn: ()=>{}},
    {name: $_("okx"), fn: ()=>{}},
    {name: $_("coinbase"), fn: ()=>{}},
    {name: $_("bitfinex"), fn: ()=>{}},
    {name: $_("gate_io"), fn: ()=>{}},
  ]
</script>

<!-- Tabs -->
<!-- Coins -->
{#if $activeTab === 0}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-b-[0.5px] py-0.5", $darkTheme ? "border-slate-700" : "border-slate-200")}>
    {#each coinItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSecondTab === i && "")} on:click={()=>{activeSecondTab.set(i); item.fn()}}>
        <span class={clsx("font-medium text-xs text-start", $activeSecondTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>


<!-- Spot -->
{:else if $activeTab === 1}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-b-[0.5px] py-0.5", $darkTheme ? "border-slate-700" : "border-slate-200")}>
    {#each spotItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSecondTab === i && "")} on:click={()=>{activeSecondTab.set(i); item.fn()}}>
        <span class={clsx("font-medium text-xs text-start", $activeSecondTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>


<!-- Leverage -->
{:else if $activeTab === 2}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-b-[0.5px] py-0.5", $darkTheme ? "border-slate-700" : "border-slate-200")}>
    {#each coinItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSecondTab === i && "")} on:click={()=>{activeSecondTab.set(i); item.fn()}}>
        <span class={clsx("font-medium text-xs text-start", $activeSecondTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>

  
<!-- Perp -->
{:else if $activeTab === 3}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-b-[0.5px] py-0.5", $darkTheme ? "border-slate-700" : "border-slate-200")}>
    {#each coinItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSecondTab === i && "")} on:click={()=>{activeSecondTab.set(i); item.fn()}}>
        <span class={clsx("font-medium text-xs text-start", $activeSecondTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>

<!-- Options -->
{:else if $activeTab === 4}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-b-[0.5px] py-0.5", $darkTheme ? "border-slate-700" : "border-slate-200")}>
    {#each coinItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSecondTab === i && "")} on:click={()=>{activeSecondTab.set(i); item.fn()}}>
        <span class={clsx("font-medium text-xs text-start", $activeSecondTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>
{/if}

<style>
</style>