<script lang="ts">
  import { _ } from "svelte-i18n"
  import MixinMenu from "../common/MixinMenu.svelte";
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]">
  <div class="w-[66pt] px-2 pl-4">
    <span class="font-semibold"> {$_("wallet")}</span>
  </div>

  <div class="flex items-center space-x-4">
    <!-- <button class={clsx($mixinConnected ? 'visible' : 'hidden')} on:click={()=>{ console.log('search') }}>
      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
    </button> -->
    <MixinMenu />
  </div>
</div>
