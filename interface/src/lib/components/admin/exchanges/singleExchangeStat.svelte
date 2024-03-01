<script lang="ts">
	import emptyToken from '$lib/images/empty-token.svg';
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";

  export let exchange = {
    name: 'binance',
    active: 1,
    failure: 0,
  }
</script>

<div class="stats shadow">  
  <div class="stat">
    <div class="stat-figure text-green-500">
      <div class="avatar">
        <div class="mask mask-squircle w-8 h-8">
          <img src={findExchangeIconByIdentifier(exchange.name) || emptyToken} alt="" />
        </div>
      </div>
    </div>
    <div class="stat-title">
      <span class="capitalize">{exchange.name}</span>
    </div>
    {#if exchange.failure > 0}
      <div class="stat-value text-red-500 my-1 mr-2">{exchange.failure} failure</div>
      <div class="stat-desc">{exchange.active} active</div>
    {:else}
      <div class="stat-value my-1 mr-2">{exchange.active} active</div>
      <div class="stat-desc">0 failure</div>
    {/if}
  </div>
</div>