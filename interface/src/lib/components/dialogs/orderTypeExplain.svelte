<script lang="ts">
  import { orderTypeExplainDialog } from "$lib/stores/trade";
</script>

<dialog
  id="order_type_explain_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$orderTypeExplainDialog}
>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-base-content/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={() => orderTypeExplainDialog.set(false)}>c</button
            >
          </form>
        </div>
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => orderTypeExplainDialog.set(false)}></button>
  </form>
</dialog>
