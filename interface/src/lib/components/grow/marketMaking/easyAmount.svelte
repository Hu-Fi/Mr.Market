<script lang="ts">
  import { _ } from "svelte-i18n"

  let tooltipOpen = false;
</script>

<div class="flex flex-col space-y-6 w-full">
  <div class="flex items-center justify-center space-x-2">
    <span class="text-xl font-semibold ml-2"> 2. {$_('enter_amount')} </span>
    <button on:click={()=>tooltipOpen=!tooltipOpen} class="mt-0.5">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
    </button>
  </div>
  
  <div class="flex justify-center">
    <div class="flex flex-col space-y-1">
      <input class="input input-bordered rounded-full focus:outline-none border-base-300" />

      <div>
        <span class="text-xs opacity-60"> {$_('balance')}: </span> <span class="text-xs opacity-60"> 123123 </span>
      </div>
    </div>
  </div>
</div>