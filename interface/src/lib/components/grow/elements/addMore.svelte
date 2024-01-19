<script>
  import { _ } from "svelte-i18n"
  import { addMoreDialog } from "$lib/stores/grow";
</script>

<div class="flex items-center justify-center !my-8">
  <button class="btn btn-sm border border-base-200 h-[2.5rem] no-animation bg-base-100 hover:bg-base-100 hover:border-base-100 focus:bg-base-100 rounded-full" on:click={()=>addMoreDialog.set(true)}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
    <span> {$_('add_more')} </span>
  </button>
</div>