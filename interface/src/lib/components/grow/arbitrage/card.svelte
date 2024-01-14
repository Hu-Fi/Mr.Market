<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import { DownColorText, UpColorText } from "$lib/helpers/constants";
  import { daysBetweenToday, formatDecimals } from "$lib/helpers/utils";

  export let data = {type: 'arb', name: $_('arbitrage'), baseExchange: 'binance', targetExchange: 'okx', base: 'BTC', target: 'USDT', profit: '1.241', amount: '', started: '2023-12-28T12:00:12Z', id: 'df7b605f-ce06-4c3a-abb6-2fe947016fab' }
  $: makingProfit = Number(data.profit) >= 0
</script>

<div class="flex flex-col rounded-xl border border-base-200 relative">
  <div class="absolute right-0 -top-1 flex items-center justify-end">
    <span class="text-xs text-base-100 from-sky-400 to-blue-500 bg-gradient-to-r px-6 py-0.5 rounded-tr-lg rounded-bl-lg">
      {$_('arbitrage')}
    </span>
  </div>
  <button class="flex flex-col bg-base-100 rounded-xl p-4 space-y-6" on:click={()=>goto(`/grow/arbitrage/${data.id}`)}>
    <!-- Title -->
    <div class="flex space-x-2 w-full justify-start">
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
  </button>
</div>