<script>
  import { SHOW_BAR } from "$lib/helpers/constants";
</script>

{#if SHOW_BAR}
  <div class="border w-[66pt] h-[23pt] rounded-full flex justify-between items-center px-2">
    <button>
      <!-- Menu Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
    </button>

    <div>
      <div class="divider divider-vertical w-[1px] h-[20px] border border-base-200"></div>
    </div>

    <button>
      <!-- Close Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
{:else}
  <div class="w-[66pt] h-[23pt] px-2"></div>
{/if}