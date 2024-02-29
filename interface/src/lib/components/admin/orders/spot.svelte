<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import type { AdminSpotOrder } from "$lib/types/hufi/admin";
  import SingleSpot from "$lib/components/admin/orders/singleSpot.svelte";

  let orders: AdminSpotOrder[] = [
    {
      type: 'limit buy',
      userID: 'c51ed85a-1684-4b90-81c7-9e4722d50d98',
      exchange: 'binance',
      symbol: 'BTC/USDT',
      amount: '2131.23',
      state: 'Created',
      time: '2024-02-29 13:55:12',
    },
    {
      type: 'market sell',
      userID: 'c51ed85a-1684-4b90-81c7-9e4722d50d98',
      exchange: 'bitfinex',
      symbol: 'ETH/USDT',
      amount: '213.3241',
      state: 'Success',
      time: '2024-02-28 13:55:12',
    },
    {
      type: 'limit buy',
      userID: 'c51ed85a-1684-4b90-81c7-9e4722d50d98',
      exchange: 'okx',
      symbol: 'SOL/USDT',
      amount: '642.3241',
      state: 'Canceled',
      time: '2024-02-20 13:55:12',
    },
  ];
</script>

<div class="overflow-x-auto">
  <div class="flex items-center">
    <button class="btn btn-xs btn-ghost hover:bg-base-100" on:click={()=>{goto('/manage/orders/spot')}}>
      <span class="font-semibold text-base"> {$_('spot')} </span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
        <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
      </svg>      
    </button>
  </div>
  <table class="table mt-4">
    <!-- head -->
    <thead>
      <tr>
        <th>{$_("exchange")}</th>
        <th>{$_("type")}</th>
        <th>{$_("symbol")}</th>
        <th>{$_("amount")}</th>
        <th>{$_("state")}</th>
        <th>{$_("user_id")}</th>
        <th>{$_("time")}</th>
      </tr>
    </thead>
    <tbody>
      {#each orders as order}
        <SingleSpot {order} />
      {/each}
    </tbody>
  </table>
</div>
