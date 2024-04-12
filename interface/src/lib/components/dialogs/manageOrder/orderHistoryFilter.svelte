<script lang="ts">
  import { historyFilterDialog } from "$lib/stores/spot";
  // historyFilterMode
  // let items = [
  //   {index: 1, name: $_("limit_order"), fn: ()=>{}},
  //   {index: 2, name: $_("market_order"), fn: ()=>{}},
  // ]
</script>

<dialog
  id="order_history_filter_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$historyFilterDialog}
>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-slate-800/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={() => historyFilterDialog.set(false)}>c</button
            >
          </form>
        </div>
      </div>
    </div>

    <div class="">
      <!-- Pair -->
      <!-- Limit/Market -->
      <!-- Buy/Sell -->
      <!-- Start time -->
      <!-- End time -->
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => historyFilterDialog.set(false)}></button>
  </form>
</dialog>
