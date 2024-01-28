<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { darkTheme } from "$lib/stores/theme";
    import { SwapConfirmDialog } from "$lib/stores/swap";

  let active = false;
</script>

<div class="flex items-center justify-center !mt-4 px-4">
  <button class={clsx("btn btn-md !h-[2.5rem] rounded-2xl w-full no-animation",
    $darkTheme ? 
      active ? '' : 'bg-gray-700 border-gray-700 hover:bg-gray-700 hover:border-gray-700' :
      active ? 'bg-base-content hover:bg-base-content focus:bg-base-content text-base-100' : 'bg-gray-50 border-gray-50 hover:bg-gray-50 hover:border-gray-50')}
    on:click={()=>SwapConfirmDialog.set(true)}
  >
    <span class="font-semibold text-sm">
      {$_('swap')}
    </span>
  </button>
</div>