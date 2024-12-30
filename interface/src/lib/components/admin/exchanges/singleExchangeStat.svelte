<script lang="ts">
  import { _ } from 'svelte-i18n';
  import emptyToken from '$lib/images/empty-token.svg';
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";

  export let exchange = {
    key_id: 2,
    exchange: 'bigone',
    name: 'bigone_1',
    api_key: '15df73c3-e8a6-11ee-8d9b-de2f3744cf12'
  };
</script>

<div class="stats shadow">  
  <div class="stat">
    <div class="stat-figure text-green-500">
      <div class="avatar">
        <div class="mask mask-squircle w-8 h-8">
          <img src={findExchangeIconByIdentifier(exchange.exchange) || emptyToken} alt="" />
        </div>
      </div>
    </div>
    <div class="stat-title">
      <span class="capitalize">{exchange.name}</span>
    </div>
    <div class="stat-value my-1 mr-2 capitalize">{exchange.exchange}</div>
    <div class="stat-desc">{$_("key_id")}: {exchange.key_id}</div>
  </div>
</div>