<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
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
  <button class="text-left stats shadow" on:click={() => {goto(`/manage/rebalance/balances/${info.name}`)}}>
    <div class="stat">
      <div class="stat-value">{info.name}</div>
      <div class="stat-title">
        {Object.keys(info.balance.total).length} {$_("assets")}
      </div>

      <div class="stat-figure text-secondary pl-6">
        <div class="avatar">
          <div class="w-12 rounded-full">
            <img src={findExchangeIconByIdentifier(info.exchange)} alt="" />
          </div>
        </div>
      </div>
    </div>
  </button>
</div>