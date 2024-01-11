<script lang="ts">
  import { _ } from "svelte-i18n"
  import MixinMenu from "../common/MixinMenu.svelte";
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]">
  <div class="flex items-center space-x-4 w-full px-4">
    <button on:click={()=>history.back()}>
      <!-- Chevron left Icon -->
      <svg class="w-7 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>    
    </button>
  </div>
  
  <div class="flex items-center space-x-4">
    <MixinMenu />
  </div>
</div>