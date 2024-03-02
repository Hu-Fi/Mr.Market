<script lang="ts">
  import { _ } from "svelte-i18n"
  import { formatTimestampToTime } from "$lib/helpers/utils";
  import type { ArbitrageDetailHistoryType } from "$lib/types/hufi/arbitrage";

  export let type: ArbitrageDetailHistoryType = 'sell'
</script>

<div class="flex w-full border rounded-2xl p-6 space-x-6">
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
    {:else if type === 'buy'}
      <svg xmlns="http://www.w3.org/2000/svg" name="arrow-down-on-square" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
      </svg>
    {:else if type === 'sell'}
      <svg xmlns="http://www.w3.org/2000/svg" name="arrow-up-on-square" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
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
        <span> {$_('deposit_amount_made', {values:{amount: '1.123', symbol:'BTC'}})} </span>
      {:else if type === 'withdraw'}
        <span> {$_('withdraw_amount_made', {values:{amount: '1.123', symbol:'BTC'}})} </span>
      {:else if type === 'buy'}
        <span> {$_('buy_token_for_amount', {values:{amount0: '1.123', symbol0: 'BTC', amount1: '1223.12', symbol1: 'USDT'}})} </span>
      {:else if type === 'sell'}
        <span> {$_('sell_token_for_amount', {values:{amount0: '1.123', symbol0: 'BTC', amount1: '3423.1234', symbol1: 'USDT'}})} </span>
      {:else if type === 'delete'}
        <span> {$_('arbitrage_deleted')} </span>
      {:else if type === 'stop'}
        <span> {$_('arbitrage_stopped')} </span>
      {:else if type === 'resume'}
        <span> {$_('arbitrage_resumed')} </span>
      {/if}
    </div>

    {#if type === 'buy' || type === 'sell'}
      <!-- Exchange name -->
      <div>
        <span class="text-xs opacity-60"> {'Binance'} </span>
      </div>
    {/if}

    <!-- Time -->
    <div>
      <span class="text-xs opacity-60"> {formatTimestampToTime('2024-01-28T21:52:21', true, true)} </span>
    </div>
  </div>
</div>