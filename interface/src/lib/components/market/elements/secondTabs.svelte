<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { page } from "$app/stores";
  import { darkTheme } from "$lib/stores/theme";  
  import { activeSecondTab } from "$lib/stores/market";
  import { SUPPORTED_EXCHANGES } from "$lib/helpers/constants";
  
  const MARKET_BAR_ITEMS = [
    { name: $_("token"), key: '/market/token' },
    { name: $_("spot"), key: '/market/spot' },  
  ];

  const coinItems = [
    {name: $_("all")},
    {name: $_("favorites")},
    {name: $_("mainstream")},
    {name: $_("layer1")},
    {name: $_("layer2")},
    {name: $_("inscription")},
    {name: $_("ai")},
    {name: $_("meme")},
    {name: $_("defi")},
    {name: $_("game_fi")},
    {name: $_("nft")},
  ]

  const spotItems = [{ name: 'all' }, ...SUPPORTED_EXCHANGES.map(exchange => ({ name: exchange }))];

  $: active = $page.url.pathname.includes(MARKET_BAR_ITEMS[0].key) ? 0 : 
    $page.url.pathname.includes(MARKET_BAR_ITEMS[1].key) ? 1 : 0
</script>

<!-- Tabs -->
<!-- Coins -->
{#if active === 0}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-b-[0.5px] py-0.5", $darkTheme ? "border-slate-700" : "border-slate-200")}>
    {#each coinItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSecondTab === i && "")} on:click={()=>{activeSecondTab.set(i);}}>
        <span class={clsx("font-medium text-xs text-start", $activeSecondTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>


<!-- Spot -->
{:else if active === 1}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-b-[0.5px] py-0.5", $darkTheme ? "border-slate-700" : "border-slate-200")}>
    {#each spotItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSecondTab === i && "")} on:click={()=>{activeSecondTab.set(i);}}>
        <span class={clsx("font-medium text-xs text-start capitalize", $activeSecondTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>


<!-- Leverage -->
{:else if active === 2}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-b-[0.5px] py-0.5", $darkTheme ? "border-slate-700" : "border-slate-200")}>
    {#each coinItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSecondTab === i && "")} on:click={()=>{activeSecondTab.set(i);}}>
        <span class={clsx("font-medium text-xs text-start", $activeSecondTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>

  
<!-- Perp -->
{:else if active === 3}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-b-[0.5px] py-0.5", $darkTheme ? "border-slate-700" : "border-slate-200")}>
    {#each coinItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSecondTab === i && "")} on:click={()=>{activeSecondTab.set(i);}}>
        <span class={clsx("font-medium text-xs text-start", $activeSecondTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>

<!-- Options -->
{:else if active === 4}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-b-[0.5px] py-0.5", $darkTheme ? "border-slate-700" : "border-slate-200")}>
    {#each coinItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSecondTab === i && "")} on:click={()=>{activeSecondTab.set(i);}}>
        <span class={clsx("font-medium text-xs text-start", $activeSecondTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>
{/if}