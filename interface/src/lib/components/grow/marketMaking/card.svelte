<script lang="ts">
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { daysBetweenToday } from "$lib/helpers/utils";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";

  export let data = {
    "orderId": "123a3eeb-e072-4d32-9a1d-6379537007fe",
    "userId": "44d9717d-8cae-4004-98a1-f9ad544dcfb1",
    "pair": "BTC/USDT-ERC20",
    "exchangeName": "okx",
    "bidSpread": "0.1",
    "askSpread": "0.1",
    "orderAmount": "1",
    "orderRefreshTime": "15000",
    "numberOfLayers": "1",
    "priceSourceType": "mid_price",
    "amountChangePerLayer": "1",
    "amountChangeType": "percentage",
    "ceilingPrice": "0",
    "floorPrice": "0",
    "balanceA": null,
    "balanceB": null,
    "state": "created",
    "createdAt": "2024-04-10T20:36:25.450Z"
  }
</script>

<div class="flex flex-col rounded-xl border border-base-200 relative shadow-sm">
  <button class="flex flex-col bg-base-100 rounded-xl p-4 space-y-4" on:click={()=>goto(`/grow/market_making/${data.orderId}`)}>
    <!-- Title -->
    <div class="flex justify-between items-center w-full">
      <div class="flex space-x-2 justify-start">
        <!-- Exchange Icon -->
        <div class="flex avatar items-center">
          <div class="w-6 h-6 rounded-full">
            <img class="" src={findExchangeIconByIdentifier(data.exchangeName)} alt=""/>
          </div>
        </div>
        <!-- Name -->
        <span class="text-base font-bold capitalize">
          {data.exchangeName}
        </span>
      </div>
      <span class="text-xs text-green-600 border-green-600 px-2.5 bg-base-100 border rounded-md text-nowrap">
        {$_('market_making')}
      </span>
    </div>
    
    <div class="flex w-full justify-between items-center">
      <div class="flex flex-col space-y-2 text-xs justify-start">
        <div class="flex space-x-2 items-center mt-1">
          <!-- arrow left right icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          <span class="uppercase text-[10px] font-medium">{data.pair.replaceAll('-ERC-20','')}</span>
        </div>
        <div class="flex space-x-2 items-center mt-1">
          <!-- clock icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span class="text-[10px] font-medium"> 
            { 
              Number(daysBetweenToday(data.createdAt)) > 1 ? 
                $_('created_days_ago', {values:{days:daysBetweenToday(data.createdAt)}}) :
                $_('recently_created')
            } 
          </span>
        </div>
      </div>
      
      <div class="flex flex-col space-y-1 items-end">
        <!-- <div class={clsx(makingProfit ? UpColorText : DownColorText)}>
          <span class='text-xl font-bold'>
            {makingProfit?'+':''}{formatDecimals(data.profit, 2)}</span><span class="text-xs">%
          </span>
        </div> -->
        <span class="text-xs opacity-80">
          <!-- {data.amount} {data.target} -->
        </span>
      </div>
    </div>
  </button>
</div>