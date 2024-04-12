<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { darkTheme } from "$lib/stores/theme";
  import { Input, Output, SwapConfirmDialog } from "$lib/stores/swap";

  $: active = $Input && $Output
</script>

<div class="flex items-center justify-center !mt-4 px-4">
  <button class={clsx("btn btn-md !h-[2.5rem] rounded-full w-full no-animation",
    $darkTheme ? 
      active ? 'bg-slate-800 hover:bg-slate-800 focus:bg-slate-800 text-base-100' : 'bg-gray-700 border-none hover:bg-gray-700 hover:border-none' :
      active ? 'bg-slate-800 hover:bg-slate-800 focus:bg-slate-800 text-base-100' : 'bg-stone-100 border-stone-100 hover:bg-stone-100 hover:border-stone-100')}
    on:click={()=>{ if(active)SwapConfirmDialog.set(true)} }
    data-testid="swap-confirm-btn"
  >
    <span class="font-semibold text-sm">
      {$_('swap')}
    </span>
  </button>
</div>