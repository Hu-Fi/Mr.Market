<!-- Balance card in rebalance page without asset list -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import emptyToken from '$lib/images/empty-token.svg';
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  export let info: {
    key_id: number;
    exchange: string;
    name: string;
    balance: {
      free: Record<string, number>;
      used: Record<string, number>;
      total: Record<string, number>;
    };
  };
</script>

<div class="tooltip tooltip-top" data-tip={`ID: ${info.key_id}`}>
  <button class="stats shadow select-none" on:click={() => goto(`/manage/rebalance/balances/${info.key_id}`)}>
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