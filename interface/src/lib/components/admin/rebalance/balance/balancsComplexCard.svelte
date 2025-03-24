<!-- Balance card in balance details page with asset list -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { BN } from "$lib/helpers/utils";
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
  export let path = '';
</script>

<div class="tooltip tooltip-top h-full" data-tip={
  `${info.exchange}: ${info.key_id}`
}>
  <button class="stats shadow h-full" on:click={() => goto(path)} >
    <div class="stat text-left h-full">
      <div class="stat-figure text-green-500">
        <div class="avatar">
          <div class="mask mask-squircle w-8 h-8">
            <img src={findExchangeIconByIdentifier(info.exchange) || emptyToken} alt="" />
          </div>
        </div>
      </div>
      <div class="mb-2">
        <span class="capitalize text-base-content">{info.name}</span>
      </div>
      {#each Object.keys(info.balance.total) as asset}
        <div class="text-xs font-light opacity-60 my-1 mr-2">{asset}: {BN(info.balance.total[asset]).toString(10)}</div>
      {/each}
    </div>
  </button>
</div>
