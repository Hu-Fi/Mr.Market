<script lang="ts">
  import { _ } from "svelte-i18n";
  import { SwapConfirmDialog } from "$lib/stores/swap";
</script>

<dialog
  id="swap_confirm_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$SwapConfirmDialog}
>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => SwapConfirmDialog.set(false)}></button>
  </form>
  <div class="modal-box space-y-6 px-0 pt-5"></div>
</dialog>