<script lang="ts">
  import { _ } from "svelte-i18n"
  import { editArbitrageDialog } from "$lib/stores/grow";

  let items = [
    { name: $_("deposit"), intro: $_('deposit_info', {values:{grow_type:$_("arbitrage")}}), fn: () => {console.log(0)} },
    { name: $_("withdraw"), intro: $_('withdraw_info', {values:{grow_type:$_("arbitrage")}}), fn: () => {console.log(1)} },
    { name: $_("delete"), intro: $_('delete_info', {values:{grow_type:$_("arbitrage")}}), fn: () => {console.log(2)} },
  ];
</script>

<dialog
  id="grow_edit_arbitrage_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$editArbitrageDialog}
>
  <div class="modal-box space-y-3 pt-0 pl-6">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-slate-800/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={() => editArbitrageDialog.set(false)}>c</button
            >
          </form>
        </div>
      </div>
    </div>

    <div class="flex flex-col">
      {#each items as item, i} 
        <button class="flex space-x-6 my-6 text-start items-center" on:click={()=>{item.fn(); editArbitrageDialog.set(false)}}>
          {#if i === 0}
            <svg name="plus-circle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>          
    
          {:else if i === 1}
            <svg name="minus-circle" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
              
          {:else if i === 2}
            <svg name="archive-box-x-mark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>          
          {/if}
        
          <div class="flex flex-col space-y-1">
            <span class="text-base font-bold">
              {item.name}
            </span>
            <span class="text-xs font-normal opacity-60">
              {item.intro}
            </span>
          </div>
        </button>
      {/each}
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => editArbitrageDialog.set(false)}></button>
  </form>
</dialog>
