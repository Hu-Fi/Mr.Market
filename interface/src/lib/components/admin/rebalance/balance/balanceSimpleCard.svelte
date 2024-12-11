<script>
  import { goto } from "$app/navigation";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  export let info = {
    name: "Mixin",
    total: "$5000",
    percentage: "10",
    assets: [
      { symbol: "USDT", amount: "$1000", },
      { symbol: "BTC", amount: "$1000" },
      { symbol: "ETH", amount: "$1000" },
    ],
  };
</script>

<button class="text-left stats shadow" on:click={() => {goto(`/manage/rebalance/balances/${info.name}`)}}>
  <div class="stat">
    <div class="stat-value">{info.total}</div>
    <div class="stat-title">{info.name}</div>        
    <div class="stat-desc text-secondary">{info.percentage}%</div>
    <div class="stat-figure text-secondary pl-6">
      <div class="avatar">
        <div class="w-14 rounded-full">
          <img src={findExchangeIconByIdentifier(info.name)} alt="" />
        </div>
      </div>
    </div>
  </div>
</button>
