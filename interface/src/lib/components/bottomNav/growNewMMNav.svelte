<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { createMMConfirmDialog, createMMEasyAmounts } from "$lib/stores/grow";

  $: inputValid = $createMMEasyAmounts[0] && $createMMEasyAmounts[1]
</script>

<div
  class={clsx(
    "btm-nav btm-nav-xs h-[3.25rem] visible bg-transparent flex items-center justify-center mb-3",
    !$page.url.pathname.includes('grow/market_making/new/easy/two') && 'hidden'
  )}
>
  <div>
    <button
      class={clsx("btn btn-md w-36 !h-[2.5rem] border-none bg-slate-800 hover:bg-slate-800 rounded-full text-base-100 no-animation", !inputValid && "btn-disabled")}
      disabled={!inputValid}
      on:click={() => {
        createMMConfirmDialog.set(true);
      }}
      data-testid="confirm-btn"
    >
      <span>
        { $_('confirm') }
      </span>
    </button>
  </div>
</div>
