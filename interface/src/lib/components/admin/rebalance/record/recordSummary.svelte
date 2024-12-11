<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import { formatTimestampToTime } from "$lib/helpers/utils";

  let records = [
    {
      symbol: "BTC",
      amount: "0.0001 BTC",
      value: "$100",
      from: "Binance",
      to: "Mixin",
      viewLink: "#",
      timestamp: "2024-12-11 10:00"
    },
    {
      symbol: "ETH",
      amount: "0.1 ETH",
      value: "$400",
      from: "Mixin",
      to: "Gate",
      viewLink: "#",
      timestamp: "2024-12-11 09:00"
    },
    {
      symbol: "XIN",
      amount: "0.5 XIN",
      value: "$1000",
      from: "Mexc",
      to: "Mixin",
      viewLink: "#",
      timestamp: "2024-12-11 08:30"
    },
  ];
</script>
<!-- Title -->
<div class="flex justify-between items-center">
  <span class="text-xl font-bold">{$_("rebalance_records")}</span>
  <button class="btn btn-ghost flex items-center" on:click={() => goto("/manage/rebalance/records")}>
    <span>
      {$_("view_all")}
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>    
  </button>
</div>
<!-- Record List -->
<div class="card bg-base-100 shadow-md">
  <div class="card-body p-2">
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>{$_("symbol")}</th>
            <th>{$_("amount")}</th>
            <th>{$_("value")}</th>
            <th>{$_("source")}</th>
            <th>{$_("destination")}</th>
            <th>{$_("time")}</th>
            <th>{$_("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {#each records as r}
            <tr>
              <td class="flex items-center space-x-2">
                <img src={findCoinIconBySymbol(r.symbol)} alt={r.symbol} class="w-6 h-6" />
                <span class="text-sm font-bold">
                  {r.symbol}
                </span>
              </td>
              <td>{r.amount}</td>
              <td>{r.value}</td>
              <td>{r.from}</td>
              <td>{r.to}</td>
              <td>{formatTimestampToTime(r.timestamp, true)}</td>
              <td><a class="text-blue-600" href={r.viewLink}>{$_("view")}</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>