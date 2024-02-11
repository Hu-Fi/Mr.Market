<script lang="ts">
  import { _ } from "svelte-i18n"
  import OrderBookModeDialog from "$lib/components/dialogs/orderBookMode.svelte";
  import { orderBookModeDialog, orderBookMode } from "$lib/stores/trade";

  const toggleLayout = () => {
    switch ($orderBookMode){
      case 0:
        orderBookMode.set(1)
        break
      case 1:
        orderBookMode.set(2)
        break
      case 2:
        orderBookMode.set(0)
        break
    }
  }
</script>

<div class="flex space-x-3">
  <button class="btn btn-xs btn-outline border-base-300 hover:bg-base-200 hover:border-base-300 hover:text-base-content w-20 rounded-md text-start justify-between no-animation" on:click={()=>{orderBookModeDialog.set(true)}}>
    <span>
      {$orderBookMode === 0 ? $_('all') : 
        $orderBookMode === 1 ?  $_('asks') : 
        $orderBookMode === 2 ?  $_('bids'): ''}
    </span>
    {#if !$orderBookModeDialog}
      <!-- Caret down Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill="currentColor"></path></svg>
    {:else}
      <!-- Caret up Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill="currentColor"></path></svg>
    {/if}
  </button>

  <button class="btn btn-xs btn-outline border-base-300 hover:bg-base-200 hover:border-base-300 hover:text-base-content px-1" on:click={()=>{toggleLayout()}}>
    <!-- Layout Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
  </button>
</div>
<OrderBookModeDialog />