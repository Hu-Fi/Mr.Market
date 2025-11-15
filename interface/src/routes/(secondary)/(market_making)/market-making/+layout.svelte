<script>
  import MixinMenu from "$lib/components/common/MixinMenu.svelte";
</script>

<header class="sticky top-0 z-10 bg-base-100 pl-4 pr-[6px]">
  <div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px]">
    <button class="" on:click={()=>{ history.back() }}>
      <!-- Chevron left Icon -->
      <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>    
    </button>

    <div class="">
      <MixinMenu />
    </div>
  </div>

</header>
<main class="mt-2 mb-20">
  <slot />
</main>