<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { daysBetweenToday } from "$lib/helpers/utils";
  import { findCoinIconBySymbol} from "$lib/helpers/helpers";
  import { DownColorText, UpColorText } from "$lib/helpers/constants";

  export let data = {type: 'auto',name: $_('auto_invest'), base: 'CNY', target: 'Bitcoin', targetSymbol: 'BTC', profit: '10', amount: '450', period: '10', started: '2023-09-28T12:00:12Z', id: '313c542d-7122-4db5-8792-2a1339453af7' }

  let infos = [
    { f: 'period', key: $_('period'), value: 'Everyday' },
    { f: 'profit', key: $_('profit'), value: data.profit },
    { f: 'amount', key: $_('amount'), value: data.amount },
    { f: 'days', key: $_('days'), value: daysBetweenToday(data.started) },
  ]

  // let actions = [
  //   { f: 'delete', key: $_('delete'), fn: ()=> {} },
  //   { f: 'buy', key: $_('buy_more'), fn: ()=> {} },
  //   { f: 'info', key: $_('info'), fn: ()=> {} },
  // ]

  $: makingProfit = Number(data.profit) >= 0
</script>

<button class="flex flex-col border border-base-200 rounded-2xl p-4 space-y-6 collapse-title" on:click={()=>goto(`/grow/auto_invest/${data.id}`)}>
  <!-- Title -->
  <div class="flex w-full justify-between items-center">
    <div class="flex space-x-2">
      <!-- Exchange Icon -->
      <div class="flex avatar items-center">
        <div class="w-6 h-6 rounded-full">
          <img class="" src={findCoinIconBySymbol(data.targetSymbol)} alt=""/>
        </div>
      </div>
    
      <!-- Name -->
      <div class="capitalize font-bold text-lg">
        <span>{data.target}</span>
      </div>
    </div>

    <div class="flex items-center">
      <span class="h-full text-xs !text-[10px] badge text-red-700 badge-outline badge-xs py-0"> {data.name} </span>
    </div>  
  </div>

  <!-- Infos -->
  <div class="flex flex-col space-y-3 w-full">
    {#each infos as info}
      <div class="flex justify-between text-xs">
        <span class="">
          {info.key}
        </span>

        {#if info.f === 'profit'}
          <span class={clsx(makingProfit ? UpColorText : DownColorText)}>
            {makingProfit ? '+': ''}{info.value}%
          </span>
        {:else if info.f === 'amount'}
          <span>
            {info.value} {data.base}
          </span>
        {:else}
          <span>
            {info.value}
          </span>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Actions -->
  <!-- <div class="grid grid-cols-3 gap-4">
    {#each actions as action}
      <button class="flex flex-col items-center justify-center space-y-1 bg-base-100 rounded-2xl py-2" on:click={()=>action.fn()}>
        {#if action.f === 'buy'}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>          
        {:else if action.f === 'delete'}        
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
        {:else if action.f === 'info'}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
        {/if}
        <span class="text-xs !text-[10px]"> { action.key } </span>
      </button>
    {/each}
  </div> -->
</button>