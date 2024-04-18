<script lang="ts">
  import { _ } from "svelte-i18n"
  import { orderFilterDialog, orderFilterMode } from "$lib/stores/spot";
  
  let items = [
    {index: 0, name: $_("limit_order"), fn: ()=>{}},
    {index: 1, name: $_("market_order"), fn: ()=>{}},
  ]
</script>

<dialog
  id="order_filter_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$orderFilterDialog}
>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-slate-800/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={() => orderFilterDialog.set(false)}>c</button
            >
          </form>
        </div>
      </div>
    </div>

    <div class="">
      {#each items as item, i}
      <button class="flex justify-between py-4 w-full text-start" on:click={()=>{orderFilterMode.set(i);orderFilterDialog.set(false)}}>
        <span class="font-medium">{item.name}</span>
        {#if i === $orderFilterMode}
          <div>
            <!-- Circle check Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>          
          </div>
        {/if}
      </button>
    {/each}
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => orderFilterDialog.set(false)}></button>
  </form>
</dialog>
