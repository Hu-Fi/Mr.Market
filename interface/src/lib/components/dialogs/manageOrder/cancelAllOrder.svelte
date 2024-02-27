<script lang="ts">
  import { _ } from "svelte-i18n"
  import { cancelAllOrderDialog } from "$lib/stores/spot";

  const cancelAll = () => {
    // Call API to cancel
    console.log()
    cancelAllOrderDialog.set(false)
  }
</script>

<dialog
  id="cancel_all_order_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$cancelAllOrderDialog}
>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-base-content/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={() => cancelAllOrderDialog.set(false)}>c</button
            >
          </form>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center py-4">
      <span class="font-bold">
        {$_('confirm_cancel_all')}
      </span>
    </div>

    <div class="flex items-center justify-center pb-4">
      <button class="btn btn-md h-[2.5rem] min-h-[2.5rem] rounded-full bg-gradient-to-r from-sky-500 to-blue-500" on:click={cancelAll}>
        <span class="text-base-100 text-sm font-semibold"> {$_("confirm")} </span> 
      </button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => cancelAllOrderDialog.set(false)}></button>
  </form>
</dialog>
