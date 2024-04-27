<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { page } from "$app/stores";
  import { onDestroy } from "svelte";
  import { darkTheme } from "$lib/stores/theme";  
  import { activeCoinTab } from "$lib/stores/home";
  import { CoinsTypeTabs, SUPPORTED_EXCHANGES } from "$lib/helpers/constants";
    import { activeSpotTab } from "$lib/stores/market";
  
  const MARKET_BAR_ITEMS = [
    { name: $_("token"), key: '/market/token' },
    { name: $_("spot"), key: '/market/spot' },  
  ];

  
  const spotItems = [{ name: 'all' }, ...SUPPORTED_EXCHANGES.map(exchange => ({ name: exchange }))];

  $: active = $page.url.pathname.includes(MARKET_BAR_ITEMS[0].key) ? 0 : 
    $page.url.pathname.includes(MARKET_BAR_ITEMS[1].key) ? 1 : 0

  onDestroy(()=>{
    activeCoinTab.set(0);
    activeSpotTab.set(0);
  })
</script>

<!-- Tabs -->
<!-- Coins -->
{#if active === 0}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-y-[0.5px] py-0.5", $darkTheme ? "border-slate-800" : "border-slate-200")}>
    {#each CoinsTypeTabs as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeCoinTab === i && "")} on:click={()=>{activeCoinTab.set(i);}}>
        <span class={clsx("font-medium text-xs text-start", $activeCoinTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{$_(item.name)}</span>
      </button>
    {/each}
  </div>

<!-- Spot -->
{:else if active === 1}
  <div class={clsx("w-full overflow-x-auto no-scrollbar flex border-y-[0.5px] py-0.5", $darkTheme ? "border-slate-800" : "border-slate-200")}>
    {#each spotItems as item, i}
      <button class={clsx("btn btn-xs btn-ghost no-animation hover:bg-base-100 focus:bg-base-100 focus:border-none border-none my-1 px-3 first:pl-4 last:pr-4", $activeSpotTab === i && "")} on:click={()=>{activeSpotTab.set(i);}}>
        <span class={clsx("font-medium text-xs text-start capitalize", $activeSpotTab === i ? "opacity-100 font-semibold" : "opacity-60")}>{item.name}</span>
      </button>
    {/each}
  </div>
{/if}