<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import MixinMenu from "../common/MixinMenu.svelte";
  import { orderDetails, orderDetailsStatus } from "$lib/stores/spot.js";
  import type { SpotOrder } from "$lib/types/hufi/spot";
  $: order = $orderDetails as SpotOrder | undefined;
  $: symbol = order ? order.symbol : '';
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px]">
  <div class="flex items-center justify-start">
    <button class="flex items-center space-x-3" on:click={()=>{ history.back(); if(history.length===0) goto('/spot') }}>
      <!-- Chevron left Icon -->
      <svg class="inline-block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
      <span> {$orderDetailsStatus === 'loading' ?  $_('order_detail') : symbol || $_('order_not_found')} </span>
    </button>
  </div>

  <div class="flex items-center space-x-4">
    <MixinMenu />
  </div>
</div>
