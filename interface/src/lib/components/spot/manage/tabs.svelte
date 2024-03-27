<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { manageMode, openedOrders, orderFilterDialog } from "$lib/stores/spot";
</script>

<div class="flex px-4 py-3 border-b border-base-200 justify-between">
  <div class="flex space-x-2">
    <div class="flex items-center">
      <!-- Orders -->
      <button class={clsx("flex items-center", $manageMode!=0 && "opacity-60")} on:click={()=>{manageMode.set(0);}} data-testid="manage_orders">
        <span class="text-sm" >{$_("orders")}({$openedOrders})</span>
      </button>
      <button on:click={()=>orderFilterDialog.set(true)} data-testid="manage_orders_filter">
        {#if !$orderFilterDialog}
          <!-- Caret down Icon -->
          <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" class="h-5 w-5"><path xmlns="http://www.w3.org/2000/svg" d="M17 10L12 16L7 10H17Z" fill="currentColor"></path></svg>
        {:else}
          <!-- Caret up Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-5 w-5"><path xmlns="http://www.w3.org/2000/svg" d="M7 14L12 8L17 14L7 14Z" fill="currentColor"></path></svg>
        {/if}
      </button>
    </div>
  </div>
  
  <!-- History button -->
  <button data-testid="go_history" on:click={()=>{goto('/spot/history')}}>
    <!-- Rectangle stack Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" /></svg>    
  </button>
</div>