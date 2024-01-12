<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { findCoinIconBySymbol, findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import { DownColorText, UpColorText } from "$lib/helpers/constants";
    import { daysBetweenToday, formatDecimals } from "$lib/helpers/utils";

  export let data = {type: 'arb', name: $_('arbitrage'), baseExchange: 'binance', targetExchange: 'okx', base: 'BTC', target: 'USDT', profit: '1.241', amount: '', started: '2023-12-28T12:00:12Z', id: 'df7b605f-ce06-4c3a-abb6-2fe947016fab' }

  let infos = [
    { f: 'pair', key: $_('pair'), value: `${data.base}/${data.target}` },
    { f: 'profit', key: $_('profit'), value: data.profit },
    { f: 'amount', key: $_('amount'), value: data.amount },
  ]

  let actions = [
    { f: 'delete', key: $_('delete'), fn: ()=> {} },
    { f: 'edit', key: $_('edit'), fn: ()=> {} },
    { f: 'buy', key: $_('buy_more'), fn: ()=> {} },
  ]

  $: makingProfit = Number(data.profit) >= 0
</script>

<div class="flex flex-col from-sky-400 to-blue-500 bg-gradient-to-r rounded-2xl rounded-t-xl">
  <div class="flex items-center justify-end p-1 px-4">
    <span class="text-xs text-base-100">
      {$_('arbitrage')}
    </span>
  </div>
  <button class="flex flex-col border border-blue-300 bg-base-100 rounded-2xl p-6 pt-4 space-y-7" on:click={()=>goto(`/grow/arbitrage/${data.id}`)}>
  <!-- Title -->
  <div class="flex space-x-2 w-full justify-center">
    <div class="-rotate-45 flex -space-x-1 items-center">
      <div class="avatar">
        <div class="w-5 h-5 rounded-full rotate-45">
          <img class="" src={findExchangeIconByIdentifier(data.baseExchange)} alt=""/>        
        </div>
      </div>
      <div class="avatar">
        <div class="w-5 h-5 rounded-full rotate-45">
          <img class="" src={findExchangeIconByIdentifier(data.targetExchange)} alt=""/>
        </div>
      </div>
    </div>
    <span class="text-base font-bold capitalize">
      { data.baseExchange }/{ data.targetExchange }
    </span>
  </div>

  <div class="flex w-full justify-between items-center">
    <div class="flex flex-col space-y-2 text-xs justify-start">
      <div class="flex space-x-2 items-center mt-1">
        <!-- arrow left right icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>        
        <span class="uppercase text-[10px] font-medium">{data.base}-{data.target}</span>
      </div>
      <div class="flex space-x-2 items-center mt-1">
        <!-- clock icon -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span class="text-[10px] font-medium"> {$_('created_days_ago', {values:{days:daysBetweenToday(data.started)}})} </span>
      </div>
    </div>
    
    <div class="flex flex-col space-y-1 items-end">
      <div class={clsx(makingProfit ? UpColorText : DownColorText)}>
        <span class='text-xl font-bold'>
          {makingProfit?'+':''}{formatDecimals(data.profit, 2)}</span><span class="text-xs">%
        </span>
      </div>
      <span class="text-xs opacity-80">
        {data.amount} {data.target}
      </span>
    </div>
  </div>

  <!-- Actions -->
  <!-- <div class="grid grid-cols-3">
    {#each actions as action}
      <button class="flex flex-col items-center justify-center space-y-1" on:click={()=>action.fn()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>        
        <span class="text-xs"> { action.key } </span>
      </button>
    {/each}
  </div> -->
</button>
</div>