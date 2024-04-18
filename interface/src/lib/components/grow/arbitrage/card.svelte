<script lang="ts">
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { daysBetweenToday } from "$lib/helpers/utils";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";

  export let data = {
    "orderId": "c825457f-c25d-4ada-ad9e-4b9847b4eb27",
    "userId": "44d9717d-8cae-4004-98a1-f9ad544dcfb1",
    "pair": "BTC/USDT-ERC20",
    "amountToTrade": "1",
    "minProfitability": "0.01",
    "exchangeAName": "okx",
    "exchangeBName": "bitfinex",
    "balanceA": null,
    "balanceB": null,
    "state": "created",
    "createdAt": "2024-04-10T20:01:15.638Z"
  }
</script>

<div class="flex flex-col rounded-xl border border-base-200 relative shadow-sm">
  <button class="flex flex-col bg-base-100 rounded-xl p-4 space-y-4" on:click={()=>goto(`/grow/arbitrage/${data.orderId}`)}>
    <!-- Title -->
    <div class="flex justify-between w-full">
      <div class="flex space-x-2 justify-start">
        <div class="-rotate-45 flex -space-x-1 items-center">
          <div class="avatar">
            <div class="w-5 h-5 rounded-full rotate-45">
              <img class="" src={findExchangeIconByIdentifier(data.exchangeAName)} alt=""/>        
            </div>
          </div>
          <div class="avatar">
            <div class="w-5 h-5 rounded-full rotate-45">
              <img class="" src={findExchangeIconByIdentifier(data.exchangeBName)} alt=""/>
            </div>
          </div>
        </div>
        <span class="text-base font-bold capitalize">
          { data.exchangeAName }/{ data.exchangeBName }
        </span>
      </div>
      <div class="flex items-center justify-center">
        <span class="text-xs text-blue-600 border-blue-600 px-2.5 bg-base-100 border rounded-md">
          {$_('arbitrage')}
        </span>
      </div>
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
      
      <div class="flex flex-col space-y-1 items-end justify-end">
        <span class="text-md opacity-80">
          <!-- TODO add balance -->
        </span>
      </div>
    </div>
  </button>
</div>