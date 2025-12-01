<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import MixinMenu from "../common/MixinMenu.svelte";
  import { easyAdvancedMode } from "$lib/stores/grow";

  onDestroy(() => {
    easyAdvancedMode.set(0);
  });

  const pathMappings = {
    "simply_grow/intro": "/grow/simply_grow",
    "market_making/new/two": "/market-making/new/one",
    "market_making/new/one": "/market-making",
    "market_making/intro": "/market-making",
    "arbitrage/new/easy": "/grow/arbitrage",
    "arbitrage/intro": "/grow/arbitrage",
    "grow/simply_grow": "/grow",
    "grow/market_making": "/grow",
    "grow/arbitrage": "/grow",
  };

  const back = () => {
    for (const [key, value] of Object.entries(pathMappings)) {
      if ($page.url.pathname.includes(key)) {
        goto(value);
        return;
      }
    }
  };

  const pageNameMappings = {
    "arbitrage/intro": $_("about_arbitrage"),
    arbitrage: $_("arbitrage"),
    "market_making/intro": $_("about_market_making"),
    market_making: $_("market_making"),
    "auto_invest/intro": $_("about_auto_invest"),
    auto_invest: $_("auto_invest"),
    simply_grow: $_("simply_grow"),
  };

  $: pageName = Object.keys(pageNameMappings).reduce((acc, key) => {
    return $page.url.pathname.includes(key) ? pageNameMappings[key] : acc;
  }, "");
</script>

<div
  class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]"
>
  <div class="flex items-center px-4 w-[calc(66pt)] space-x-4">
    <button
      on:click={() => {
        back();
      }}
    >
      <!-- Chevron left Icon -->
      <svg
        class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        /></svg
      >
    </button>
    {#if pageName}
      <span class="font-bold text-nowrap"> {pageName} </span>
    {/if}
  </div>

  <div class="flex items-center">
    <MixinMenu />
  </div>
</div>
