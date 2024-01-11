<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import { DownColorText, UpColorText } from "$lib/helpers/constants";

  export let data = {type: 'mm',  name: $_('market_making'), exchange: 'binance', base: 'ETH', target: 'USDT', profit: '-1.08', amount: '17232', started: '2023-09-28T12:00:12Z', id: '1c7aeede-e14e-4017-bb38-8ffe57667b93' }

  let infos = [
    { f: 'pair', key: $_('pair'), value: `${data.base}/${data.target}` },
    { f: 'profit', key: $_('profit'), value: data.profit },
    { f: 'amount', key: $_('amount'), value: data.amount },
  ]
  $: makingProfit = Number(data.profit) >= 0
</script>

<button class="flex flex-col border rounded-2xl px-6 py-4 space-y-6" on:click={()=>goto(`/grow/market_making/${data.id}`)}>
  <!-- Title -->
  <div class="flex w-full  justify-between items-center">
    <div class="flex space-x-2">
      <!-- Exchange Icon -->
      <div class="flex avatar items-center">
        <div class="w-6 h-6 rounded-full">
          <img class="" src={findExchangeIconByIdentifier(data.exchange)} alt=""/>
        </div>
      </div>
    
      <!-- Name -->
      <div class="capitalize font-bold text-lg">
        <span>{data.exchange}</span>
      </div>
    </div>

    <div class="flex items-center">
      <span class="h-full text-xs !text-[10px] badge text-green-700 badge-outline badge-xs py-0"> {data.name} </span>
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
            {info.value} {data.target}
          </span>
        {:else}
          <span>
            {info.value}
          </span>
        {/if}
      </div>
    {/each}
  </div>
</button>