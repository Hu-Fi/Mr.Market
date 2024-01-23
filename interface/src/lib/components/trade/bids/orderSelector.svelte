<script lang="ts">
  import { orderType, orderTypeDialog } from "$lib/stores/trade";
  import OrderTypeSelector from "$lib/components/dialogs/orderTypeSelector.svelte";
</script>

<div class="w-full">
  <button class="btn btn-sm btn-outline border-base-300 hover:bg-base-200 hover:border-base-300 hover:text-base-content no-animation justify-between w-full" on:click={()=>{orderTypeDialog.set(true)}} data-testid="order_type_selector">
    <!-- Info icon -->
    <!-- <button on:click={()=>{}} class="opacity-60">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />    </svg>
    </button> -->

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