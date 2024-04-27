<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { SUPPORTED_UNIQUE_ARBITRAGE_PAIRS } from "$lib/helpers/constants";
  import { createArbAmount, createArbPair, selectArbPairDialog } from "$lib/stores/grow";
</script>

<dialog
  id="arb_select_pair_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$selectArbPairDialog}
>
  <div class="modal-box space-y-6 pt-0 px-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-4">
      <!-- Title -->
      <div class="flex justify-between mx-6">
        <span class="font-semibold"> { $_("select_a_pair")} </span>
        <button on:click={() => {selectArbPairDialog.set(false)}}>
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
    </div>

    <div class="grid grid-cols-3 gap-3 mx-4">
      {#each SUPPORTED_UNIQUE_ARBITRAGE_PAIRS as pair, i}
        <button class={
          clsx(
            "flex justify-center items-center text-left p-1 bg-base-100 rounded-full border",
            $createArbPair === pair && "bg-base-300"
          )}
          on:click={()=>{ createArbPair.set(pair); selectArbPairDialog.set(false); createArbAmount.set([]); }}
          data-testid={`pair-${i}`}
        >
          <span class="text-sm font-light mx-2">{pair}</span>          
        </button>
      {/each}
    </div>

  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => { selectArbPairDialog.set(false) }}></button>
  </form>
</dialog>
