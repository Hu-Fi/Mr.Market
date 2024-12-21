<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import emptyToken from '$lib/images/empty-token.svg';
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  export let info: {
    api_key: string;
    exchange: string;
    key_id: number;
    name: string;
  };
</script>

<div class="tooltip tooltip-top" data-tip={`ID: ${info.key_id}`}>
  <button class="stats shadow select-none min-w-80 h-full" on:click={() => {
    goto(`/manage/rebalance/deposit/exchange/${info.key_id}`);
  }}>
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
      <div class="stat-value">
        <span class="capitalize">{info.exchange}</span>
      </div>
      <div class="stat-desc">{info.api_key}</div>
    </div>
  </button>
</div>