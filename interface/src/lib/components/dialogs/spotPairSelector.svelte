<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onDestroy, onMount } from "svelte";
  import { pairsFn } from "$lib/helpers/hufi/coin";
  import { switchSpotPair } from "$lib/helpers/hufi/socket";
  import type { PairsData } from "$lib/types/hufi/exchanges";
  import Loading from "$lib/components/common/loading.svelte";
  import NoResult from "$lib/components/common/NoResult.svelte";
  import { formatDecimals, formatUSNumber } from "$lib/helpers/utils";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import { DownColorText, SUPPORTED_EXCHANGES, UpColorText } from "$lib/helpers/constants";
  import { pairExchangeFilter, pairSearch, pairSelectorDialog, pairSelectorLoaded, socket } from "$lib/stores/spot";

  let tabItems = [{ name: 'all' }, ...SUPPORTED_EXCHANGES.map(exchange => ({ name: exchange }))];

  let pairs: PairsData[];
  $: filteredPairs = pairs ?
    pairs.filter((item)=>{
      return (
        $pairExchangeFilter.toUpperCase() === 'ALL' ?
        item :
        item.exchange.toUpperCase().match($pairExchangeFilter.toUpperCase())
      )}
    ).filter((item) => {
      return (
        item.symbol.toUpperCase().match($pairSearch.toUpperCase()) ||
        item.exchange.toUpperCase().match($pairSearch.toUpperCase())
      );
    })
  : []

  $: if ($pairSelectorDialog === false) {
    pairSearch.set('')
    pairExchangeFilter.set('all')
    loadPairs()
  }

  const loadPairs = async () => {
    pairs = await pairsFn()
    pairSelectorLoaded.set(true)
  }
  onMount(async ()=> {
    await loadPairs()
  })
  onDestroy(async ()=> {
    pairSelectorLoaded.set(false)
  })
</script>

<dialog id="select_pair_modal" class="modal modal-bottom sm:modal-middle" class:modal-open={$pairSelectorDialog}>
  <div class="modal-box h-[90vh] pt-0 px-0" data-testid="spot_pair_selector_modal_box">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-20 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-slate-800/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={()=>pairSelectorDialog.set(false)} data-testid="spot_pair_selector_close">c</button>
          </form>
        </div>
      </div>

      <!-- Search -->
      <div class="join w-full px-3">
        <!-- Search Icon -->
        <div class="bg-base-200 join-item flex items-center rounded-full pl-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
        </div>
        <input bind:value={$pairSearch} class="input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-0 rounded-full bg-base-200 join-item" placeholder={$_('search')} />
      </div>

      <!-- Tabs -->
      <div class="tabs border-b w-full mt-3 px-3 overflow-x-auto no-scrollbar">
        {#each tabItems as item}
          <button class={clsx("tab", $pairExchangeFilter === item.name && "border-b border-base-content")} on:click={()=>{ pairExchangeFilter.set(item.name) }}>
            <span class={clsx("font-medium capitalize", $pairExchangeFilter === item.name ? "opacity-100" : "opacity-60")}>{item.name}</span>
          </button>
        {/each}
      </div>
    </div>
    
    {#if $pairSelectorLoaded}
      <!-- Pairs -->
      <div class="flex flex-col overflow-y-auto mt-0 px-4">
        {#if filteredPairs.length === 0}
          <div class="w-full flex items-center justify-center">
            <NoResult />
          </div>  
        {:else}
          {#each filteredPairs as c}
            <div class="w-full flex items-center justify-start space-x-2 py-3 h-16">
              <button class="flex justify-between w-full items-center" data-dismiss="select_pair_modal" on:click={()=>{
                switchSpotPair($socket, c);
              }}>
                <div class="flex items-center space-x-2.5">
                  <img src={findExchangeIconByIdentifier(c.exchange)} alt="-" loading="lazy" class="w-5 h-5" />
                  <span class="flex items-center font-semibold text-sm">
                    {c.symbol.split('/')[0]}<span class="font-light text-xs text-base-content/60">/{c.symbol.split('/')[1]}</span>
                  </span>
                </div>
        
                <div class="flex flex-col items-end">
                  {#if c.price}
                    <span class="text-sm font-semibold">
                      {formatUSNumber(c.price)}
                    </span>
                  {/if}
                  {#if c.change}
                    <span class={clsx("text-xs !text-[10px]", c.change >= 0 ? UpColorText : DownColorText)}>
                      {c.change >= 0 ? '+':''}{formatDecimals(c.change, 2)}%
                    </span>
                  {/if}
                </div>
              </button>
            </div>
          {/each}
        {/if}
      </div>
    {:else}
      <div class="flex justify-center items-center h-full">
        <Loading />
      </div>
    {/if}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={()=>pairSelectorDialog.set(false)}></button>
  </form>
</dialog>