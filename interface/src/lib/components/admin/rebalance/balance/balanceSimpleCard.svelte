<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import emptyToken from '$lib/images/empty-token.svg';
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  export let info = {
    "key_id": 2,
    "exchange": "bigone",
    "name": "bigone_1",
    "balance": {
      "free": {
        "BTC": 9.8e-9,
        "USDT": 9.66e-9,
        "ETHW": 0.4545,
        "BigONE Token": 0.00566153,
        "USDC": 0.00008,
        "NBS": 1.129
      },
    "used": {},
    "total": {
      "BTC": 9.8e-9,
      "USDT": 9.66e-9,
      "ETHW": 0.4545,
      "BigONE Token": 0.00566153,
      "USDC": 0.00008,
      "NBS": 1.129
    }
  }
};
</script>

<div class="tooltip tooltip-top" data-tip={`ID: ${info.key_id}`}>
  <button class="stats shadow" on:click={() => {goto(`/manage/rebalance/balances/${info.name}`)}}>
    <div class="stat text-left">
      <div class="stat-figure text-green-500">
        <div class="avatar">
          <div class="mask mask-squircle w-8 h-8">
            <img src={findExchangeIconByIdentifier(info.exchange) || emptyToken} alt="" />
          </div>
        </div>
      </div>
      <div class="stat-title">
        <span class="capitalize">{info.name}</span>
      </div>
      <div class="stat-value my-1 mr-2">{Object.keys(info.balance.total).length} assets</div>
    </div>
  </button>
</div>