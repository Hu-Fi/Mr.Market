<script>
  import { SwitchInputOutput } from "$lib/stores/swap";
</script>

<div class="flex justify-center items-center z-10">
  <button class="rounded-full border border-base-200 p-1 bg-base-100 shadow-sm" on:click={()=>{SwitchInputOutput()}} data-testid="switch-asset">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
  </button>
</div>