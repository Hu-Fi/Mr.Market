<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { createArbAmount, createArbConfirmDialog, createArbExchange1, createArbExchange2, createArbPair } from "$lib/stores/grow";

  $: inputValid = $createArbExchange1 && $createArbExchange2 && $createArbPair && $createArbAmount[0] && $createArbAmount[1];
  export let btnText: string = $_('confirm');
</script>

<div
  class={clsx(
    "btm-nav btm-nav-xs h-[3.25rem] visible bg-transparent flex items-center justify-center mb-3",
  )}
>
  <div>
    <button
      class={clsx("btn btn-md min-w-36 !h-[2.5rem] border-none bg-slate-800 hover:bg-slate-800 rounded-full text-base-100 no-animation", !inputValid && "btn-disabled")}
      disabled={!inputValid}
      on:click={() => {
        createArbConfirmDialog.set(true);
      }}
      data-testid="confirm-btn"
    >
      <span>
        { btnText }
      </span>
    </button>
  </div>
</div>
