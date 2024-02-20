<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { formatUSNumber } from "$lib/helpers/utils";
  import NoResult from "$lib/components/common/NoResult.svelte";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import { DownColorText, SUPPORTED_EXCHANGES, SUPPORTED_PAIRS, UpColorText } from "$lib/helpers/constants";
  import { CandlePairSelectorDialog as sd, CandlePair, CandlePairSearch, CandlePairExchangeFilter } from "$lib/stores/market";

  let items = [{ name: 'all' }, ...SUPPORTED_EXCHANGES.map(exchange => ({ name: exchange }))];

  $: placeholders = Object.entries(SUPPORTED_PAIRS).flatMap(([exchange, pairs]) => {
    return pairs.map(pair => {
      const [first, second] = pair.split('/');
      const icon = findExchangeIconByIdentifier(exchange);
      return { first, second, icon, exchange };
    });
  }).filter((item)=>{
    return (
      $CandlePairExchangeFilter.toUpperCase() === 'ALL' ?
      item :
      item.exchange.toUpperCase().match($CandlePairExchangeFilter.toUpperCase())
    )}
  ).filter((item) => {
    return (
      item.first.toUpperCase().match($CandlePairSearch.toUpperCase()) ||
      item.exchange.toUpperCase().match($CandlePairSearch.toUpperCase())
    );
  })

  $: if ($sd === false) {
    CandlePairSearch.set('')
    CandlePairExchangeFilter.set('all')
  }
</script>

<dialog id="candle_select_pair_modal" class="modal modal-bottom sm:modal-middle" class:modal-open={$sd}>
  <div class="modal-box h-[90vh] pt-0 px-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-20 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-base-content/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={()=>sd.set(false)}>c</button>
          </form>
        </div>
      </div>

      <!-- Search -->
      <div class="join w-full px-3">
        <!-- Search Icon -->
        <div class="bg-base-200 join-item flex items-center rounded-full pl-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
        </div>
        <input bind:value={$CandlePairSearch} class="input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-0 rounded-full bg-base-200 join-item" placeholder={$_('search')} />
      </div>

      <!-- Tabs -->
      <div class="tabs border-b w-full mt-3 px-3 overflow-x-auto no-scrollbar">
        {#each items as item, i}
          <button class={clsx("tab", $CandlePairExchangeFilter === item.name && "border-b border-base-content")} on:click={()=>{ CandlePairExchangeFilter.set(item.name) }}>
            <span class={clsx("font-medium capitalize", $CandlePairExchangeFilter === item.name ? "opacity-100" : "opacity-60")}>{item.name}</span>
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Pairs -->
    <div class="flex flex-col overflow-y-auto mt-0 px-4">
      {#if placeholders.length === 0}
        <div class="w-full flex items-center justify-center">
          <NoResult />
        </div>  
      {:else}
        {#each placeholders as c}
          <div class="w-full flex items-center justify-start space-x-2 py-3 h-16">
            <button class="flex justify-between w-full items-center" data-dismiss="select_pair_modal" on:click={()=>{CandlePair.set(c); sd.set(false);}}>
              <div class="flex items-center space-x-2.5">
                <img src={c.icon} alt="-" loading="lazy" class="w-5 h-5" />
                <span class="flex items-center font-semibold text-base">
                  {c.first}<span class="font-light text-xs text-base-content/60">/{c.second}</span>
                </span>
              </div>
    
              {#if c.price && c.percentage}
              <div class="flex flex-col items-end">
                <span class="text-sm font-semibold">
                  {formatUSNumber(c.price)}
                </span>
                <span class={clsx("text-xs !text-[10px]", c.percentage >= 0 ? UpColorText : DownColorText)}>
                  {c.percentage}%
                </span>
              </div>
              {/if}
            </button>
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={()=>sd.set(false)}></button>
  </form>
</dialog>