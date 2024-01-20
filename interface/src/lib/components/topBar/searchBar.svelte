<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { onDestroy } from "svelte";  
  import { darkTheme } from "$lib/stores/theme";
  import MixinMenu from "../common/MixinMenu.svelte";
  import { searchValue } from "$lib/stores/market";

  onDestroy(()=>searchValue.set(''))
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]">
  <div class="flex items-center space-x-4 w-full px-4">
    <button on:click={()=>history.back()}>
      <!-- Chevron left Icon -->
      <svg class="w-7 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>    
    </button>

    <!-- Search -->
    <div class="join w-full">
      <!-- Search Icon -->
      <div class={clsx("join-item flex items-center rounded-full pl-3", $darkTheme ? "bg-slate-800":"bg-slate-100")}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
      </div>
      <!-- svelte-ignore a11y-autofocus -->
      <input bind:value={$searchValue} class={clsx("flex items-center input input-sm text-xs pl-2 bg-slate-100 outline-none border-0 rounded-full w-full focus:outline-none focus:border-0 join-item", $darkTheme ? "bg-slate-800":"bg-slate-100")} autofocus placeholder={$_('search')} />
    </div>
  </div>
  
  <div class="flex items-center space-x-4">
    <MixinMenu />
  </div>
</div>
