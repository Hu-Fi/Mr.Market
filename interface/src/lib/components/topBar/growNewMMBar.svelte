<script lang="ts">
  import { _ } from "svelte-i18n"
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import MixinMenu from "../common/MixinMenu.svelte";

  const back = () => {
    if ($page.url.pathname.includes('/grow/market_making/new/easy/two')) {
      goto('/grow/market_making/new/easy/one')
      return;
    }
    goto('/grow/market_making/')
  }
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px]">
  <div class="flex items-center justify-start">
    <button class="" on:click={()=>{ back() }}>
      <!-- Chevron left Icon -->
      <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>    
    </button>
    
    <div class="px-2 pl-4">
      <span class="font-bold text-nowrap">
        {$page.url.pathname.includes('/grow/market_making/new/easy/one') ? $_('select_a_pair') : 
         $page.url.pathname.includes('/grow/market_making/new/easy/two') ? $_('confirm'): $_('market_making')}
      </span>
    </div>
  </div>

  <div class="flex items-center space-x-4">
    <MixinMenu />
  </div>
</div>
