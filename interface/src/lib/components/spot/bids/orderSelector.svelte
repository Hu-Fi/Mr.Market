<script lang="ts">
  import { orderType, orderTypeDialog } from "$lib/stores/spot";
  import OrderTypeSelector from "$lib/components/dialogs/orderTypeSelector.svelte";
</script>

<div class="w-full">
  <button class="btn btn-sm btn-outline border-base-300 hover:bg-base-100 hover:border-base-300 hover:text-base-content no-animation justify-between w-full" on:click={()=>{orderTypeDialog.set(true)}} data-testid="order_type_selector">
    <span class="text-clip text-start font-medium w-[70%]">
      {$orderType.name}
    </span>

    {#if !$orderTypeDialog}
      <!-- Caret down icon -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 opacity-60"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill="currentColor"></path></svg>
    {:else}
      <!-- Caret up Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 opacity-60"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill="currentColor"></path></svg>
    {/if}
  </button>
  <OrderTypeSelector />
</div>