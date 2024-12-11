<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import BalanceCard from './balanceSimpleCard.svelte';

  let balances = [
    {
      name: "Mixin",
      total: "$5000",
      percentage: "10",
      assets: [
        { symbol: "USDT", amount: "$1000", },
        { symbol: "BTC", amount: "$1000" },
        { symbol: "ETH", amount: "$1000" },
      ],
    },
    {
      name: "Binance",
      total: "$5000",
      percentage: "10",
      assets: [
        { symbol: "BTC", amount: "0.0001" },
        { symbol: "ETH", amount: "0.002" },
        { symbol: "SOL", amount: "1000" },
      ],
    },
  ];
</script>

<!-- Balances Section -->
<div class="py-4 space-y-4">
  <!-- Title -->
   <div class="flex justify-between items-center">
    <div class="text-xl font-bold">{$_("balance")}</div>
    <button class="btn btn-ghost flex items-center" on:click={() => goto("/manage/rebalance/balances")}>
      <span>
        {$_("view_all")}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>    
    </button>
   </div>

  <!-- Top Balances Section -->
  <div class="flex space-x-4">
    {#if balances.length > 0}
      {#each balances as info}
        <BalanceCard {info} />
      {/each}
    {:else}
      <div class="text-center text-gray-500">{$_("no_balance_in_wallet")}</div>
    {/if}
  </div>
</div>
