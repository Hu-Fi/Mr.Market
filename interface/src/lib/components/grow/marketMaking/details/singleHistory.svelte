<script lang="ts">
  import { _ } from "svelte-i18n"
  import { formatTimestampToTime } from "$lib/helpers/utils";
  import type { MarketMakingDetailHistoryType } from "$lib/types/hufi/market_making";

  const placeholder = {
    amount0: 1.123,
    symbol0: 'BTC',
    amount1: 52341,
    symbol1: 'USDT',
    price: 45213
  }
  export let type: MarketMakingDetailHistoryType = 'place_buy'
</script>

<div class="flex w-full border rounded-2xl p-6 space-x-4">
  <!-- Icon -->
  <div class="flex items-center">
    {#if type === 'deposit'}
      <svg xmlns="http://www.w3.org/2000/svg" name="arrow-down-tray" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>      
    {:else if type === 'withdraw'}
      <svg xmlns="http://www.w3.org/2000/svg" name="arrow-up-tray" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    {:else if type === 'place_buy'}
      <svg xmlns="http://www.w3.org/2000/svg" name="arrow-down-on-square" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
      </svg>
    {:else if type === 'place_sell'}
      <svg xmlns="http://www.w3.org/2000/svg" name="arrow-up-on-square" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
      </svg>
    {:else if type === 'buy_filled'}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    {:else if type === 'sell_filled'}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>        
    {:else if type === 'buy_canceled'}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    {:else if type === 'sell_canceled'}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>    
    {:else if type === 'delete'}
      <svg xmlns="http://www.w3.org/2000/svg" name="trash" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    {:else if type === 'stop'}
      <svg xmlns="http://www.w3.org/2000/svg" name="pause-circle" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    {:else if type === 'resume'}
      <svg xmlns="http://www.w3.org/2000/svg" name="play-circle" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
      </svg>    
    {/if}
  </div>
  <div class="flex flex-col">
    <!-- Action made -->
    <div>
      {#if type === 'deposit'}
        <span> {$_('deposit_amount_made', {values:{amount: placeholder.amount0, symbol: placeholder.symbol0}})} </span>
      {:else if type === 'withdraw'}
        <span> {$_('withdraw_amount_made', {values:{amount: placeholder.amount0, symbol: placeholder.symbol0}})} </span>
      {:else if type === 'place_buy'}
        <span> {$_('buy_order_placed', {values:{amount0: placeholder.amount0, symbol0: placeholder.symbol0, amount1: placeholder.amount1, symbol1: placeholder.symbol1, price: placeholder.price}})} </span>
      {:else if type === 'place_sell'}
        <span> {$_('sell_order_placed', {values:{amount0: placeholder.amount0, symbol0: placeholder.symbol0, amount1: placeholder.amount1, symbol1: placeholder.symbol1, price: placeholder.price}})} </span>
      {:else if type === 'buy_filled'}
        <span> {$_('buy_order_filled', {values:{amount0: placeholder.amount0, symbol0: placeholder.symbol0, amount1: placeholder.amount1, symbol1: placeholder.symbol1}})} </span>
      {:else if type === 'sell_filled'}
        <span> {$_('sell_order_filled', {values:{amount0: placeholder.amount0, symbol0: placeholder.symbol0, amount1: placeholder.amount1, symbol1: placeholder.symbol1}})} </span>
      {:else if type === 'buy_canceled'}
        <span> {$_('buy_order_canceled')} </span>
      {:else if type === 'sell_canceled'}
        <span> {$_('sell_order_canceled')} </span>
      {:else if type === 'delete'}
        <span> {$_('market_making_deleted')} </span>
      {:else if type === 'stop'}
        <span> {$_('market_making_stopped')} </span>
      {:else if type === 'resume'}
        <span> {$_('market_making_resumed')} </span>
      {/if}
    </div>

    <!-- Pair name -->
    <div>

    </div>

    <!-- Time -->
    <div>
      <span class="text-xs opacity-60"> {formatTimestampToTime('2024-01-28T21:52:21', true, true)} </span>
    </div>
  </div>
</div>