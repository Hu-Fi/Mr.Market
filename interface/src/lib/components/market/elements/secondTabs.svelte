<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { page } from "$app/stores";
  import { onDestroy, onMount } from "svelte";
  import { darkTheme } from "$lib/stores/theme";  
  import { activeCoinTab } from "$lib/stores/home";
  import { CoinsTypeTabs, SUPPORTED_EXCHANGES } from "$lib/helpers/constants";
  import { activeSpotTab, stopMarketQuery } from "$lib/stores/market";
  
  const MARKET_BAR_ITEMS = [
    { name: $_("token"), key: '/market/token' },
    { name: $_("spot"), key: '/market/spot' },  
  ];
  
  let spotItems = [];

  const loadExchanges = async () => {
    $page.data.spotInfo.then(resp => {
      if (!resp.data.exchanges) return;
      spotItems = [
        { name: 'all' }, 
        ...resp.data.exchanges.map(exchange => ({ name: exchange }))
      ];
    })
  }
  $: active = $page.url.pathname.includes(MARKET_BAR_ITEMS[0].key) ? 0 : 
    $page.url.pathname.includes(MARKET_BAR_ITEMS[1].key) ? 1 : 0

  onMount(async () => {
    await loadExchanges()
  })
  onDestroy(()=>{
    activeCoinTab.set(0);
    activeSpotTab.set('all');
  })
</script>

<!-- Tabs -->
<!-- Coins -->
{#if active === 0}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-y-[0.5px] py-0.5", $darkTheme ? "border-slate-800" : "border-slate-200")}>
    {#each CoinsTypeTabs as item, i}
      <button 
        class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeCoinTab === i && "")} 
        on:click={()=>{
          activeCoinTab.set(i); 
          stopMarketQuery.set(false);
        }}
      >
        <span class={clsx("font-medium text-xs text-start", $activeCoinTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{$_(item.name)}</span>
      </button>
    {/each}
  </div>

<!-- Spot -->
{:else if active === 1}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-y-[0.5px] py-0.5", $darkTheme ? "border-slate-800" : "border-slate-200")}>
    {#each spotItems as item}
      <button 
        class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSpotTab === item.name && "")} 
        on:click={()=>{activeSpotTab.set(item.name);}}
      >
        <span class={clsx("font-medium text-xs text-start capitalize", $activeSpotTab === item.name ? "opacity-100 font-semibold" : "opacity-60")}>
          {item.name}
        </span>
      </button>
    {/each}
  </div>
{/if}