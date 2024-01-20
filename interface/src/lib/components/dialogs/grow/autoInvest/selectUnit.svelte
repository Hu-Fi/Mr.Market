<script lang="ts">
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { createAISelectUnitDialog } from "$lib/stores/grow";
</script>

<dialog
  id="auto_invest_select_period_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$createAISelectUnitDialog}
>
  <div class="modal-box space-y-3 pt-0 pl-6">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-base-content/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={() => createAISelectUnitDialog.set(false)}>c</button
            >
          </form>
        </div>
      </div>
    </div>

    <div class="flex flex-col">
      
      <button class="flex space-x-6 my-6 text-start items-center" on:click={()=>{ createAISelectUnitDialog.set(false)}}>
          
      </button>
      
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => createAISelectUnitDialog.set(false)}></button>
  </form>
</dialog>
