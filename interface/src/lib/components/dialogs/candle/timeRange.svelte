<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
	import { CandleTimeRangeDialog } from '$lib/stores/market';

  const ranges = [
    {k:'15m',fn:()=>{}},
  ]
</script>

<dialog id="candle_select_pair_modal" class="modal modal-bottom sm:modal-middle" class:modal-open={$CandleTimeRangeDialog}>
  <div class="modal-box h-[30vh] pt-0 px-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-20 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-base-content/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={()=>CandleTimeRangeDialog.set(false)}>c</button>
          </form>
        </div>
      </div>      
    </div>

    <div class="grid grid-cols-4">
      {#each ranges as r}
        <button on:click={()=>r.fn()}> {r.k} </button>
      {/each}
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={()=>CandleTimeRangeDialog.set(false)}></button>
  </form>
</dialog>