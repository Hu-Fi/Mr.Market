<script lang="ts">
  import { _ } from "svelte-i18n";
  import { BN } from "$lib/helpers/utils";
  import emptyToken from '$lib/images/empty-token.svg';
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
    import { goto } from "$app/navigation";
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
  export let path = '';
</script>

<div class="tooltip tooltip-top" data-tip={
  `${info.exchange}: ${info.key_id}`
}>
  <button class="stats shadow" on:click={() => goto(path)}>
    <div class="stat text-left">
      <div class="stat-figure text-green-500">
        <div class="avatar">
          <div class="mask mask-squircle w-8 h-8">
            <img src={findExchangeIconByIdentifier(info.exchange) || emptyToken} alt="" />
          </div>
        </div>
      </div>
      <div class="stat-title mb-2">
        <span class="capitalize text-base-content">{info.name}</span>
      </div>
      {#each Object.keys(info.balance.total) as asset}
        <div class="stat-desc my-1 mr-2">{asset}: {BN(info.balance.total[asset]).toString(10)}</div>
      {/each}
    </div>
  </button>
</div>
