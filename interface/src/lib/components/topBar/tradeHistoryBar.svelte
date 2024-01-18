<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import MixinMenu from "../common/MixinMenu.svelte";
  import { historyFilterDialog } from "$lib/stores/trade";
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px]">
  <div class="flex items-center justify-start">
    <button class="" on:click={()=>{ history.back(); if(history.length===0) goto('/trade') }}>
      <!-- Chevron left Icon -->
      <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>    
    </button>
    
    <div class="px-2 pl-4">
      <span class="font-semibold"> {$_("history")}</span>
    </div>  
  </div>

  <div class="flex items-center space-x-4">
    <button class="" on:click={()=>{ historyFilterDialog.set(true) }}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path xmlns="http://www.w3.org/2000/svg" d="M4 7C4 6.44772 4.44772 6 5 6H19C19.5523 6 20 6.44772 20 7C20 7.55228 19.5523 8 19 8H5C4.44772 8 4 7.55228 4 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM8 17C8 16.4477 8.44772 16 9 16H15C15.5523 16 16 16.4477 16 17C16 17.5523 15.5523 18 15 18H9C8.44772 18 8 17.5523 8 17Z" fill="currentColor"></path></svg>
    </button>
    <MixinMenu />
  </div>
</div>
