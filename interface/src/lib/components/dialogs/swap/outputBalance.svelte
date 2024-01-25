<script lang="ts">
  import { _ } from "svelte-i18n";
  import { OutputBalanceDialog } from "$lib/stores/swap";
</script>

<dialog
  id="swap_output_asset_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$OutputBalanceDialog}
>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => OutputBalanceDialog.set(false)}></button>
  </form>
  <div class="modal-box space-y-6 px-0 pt-5"></div>
</dialog>