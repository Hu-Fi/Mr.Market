<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { createMMConfirmDialog } from "$lib/stores/grow"
</script>

<dialog
  id="confirm_mm_payment_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$createMMConfirmDialog}
>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-4">
      <!-- Title -->
      <div class="flex justify-between">
        <span class="font-semibold"> {$_("confirm_payment")} </span>
        <button on:click={() => createMMConfirmDialog.set(false)}>
          <!-- Close Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            /></svg
          >
        </button>
      </div>

      <!-- Estimate receive -->
      <div class="h-40 flex flex-col justify-center text-center space-y-2">
        <span class="text-xs opacity-60">
          {$_("")}
        </span>
        <span class="text-3xl font-bold">
        </span>
      </div>

      <!-- Infos -->
      <div class="flex flex-col space-y-4 my-2 mb-4">
        <div>
          
        </div>
      </div>

      <!-- Button -->
      <!-- <div class="w-full py-4 flex justify-center">
        <button
          class={clsx(
            "btn btn-md rounded-full bg-base-content hover:bg-base-content focus:bg-base-content no-animation",
            !valid && 'btn-disabled'
          )}
          on:click={()=>{}}
        >
          <span
            class={clsx(
              "text-base-100 font-semibold",
            )}
          >
            {$_("next_step")}</span
          >
        </button>
      </div> -->
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => createMMConfirmDialog.set(false)}></button>
  </form>
</dialog>
