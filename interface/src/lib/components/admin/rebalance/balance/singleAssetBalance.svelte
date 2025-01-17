<!-- Single asset balance in exchange balance details page -->
<script lang="ts">
  import { _ } from "svelte-i18n";
  import { BN } from "$lib/helpers/utils";
  import emptyToken from '$lib/images/empty-token.svg';
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  
  export let symbol: string;
  export let amount: number;
</script>

<div class="flex items-center justify-between p-4 px-6 border-b border-x first:rounded-t-2xl last:rounded-b-2xl first:border-t last:border-b">
  <div class="flex items-center space-x-4">
    <div class="avatar">
      <div class="mask mask-squircle w-8 h-8">
        <img src={findCoinIconBySymbol(symbol) || emptyToken} alt="" class="">
      </div>
    </div>
    <div class="flex flex-col select-text">
      <div class="flex items-center space-x-2">
        <span class="text-base capitalize font-semibold"> {symbol} </span>
        <span class="text-xs opacity-60"> {BN(amount).toFixed()} </span>
      </div>
    </div>
  </div>
</div>