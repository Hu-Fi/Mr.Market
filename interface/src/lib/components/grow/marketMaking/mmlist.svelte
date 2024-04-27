<script lang="ts">
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";

  const list = []
</script>

<!-- Zero mm created -->
{#if list.length === 0}
  <div class="flex flex-col grow mx-6 h-full justify-center items-center space-y-6 mb-24">
    <div class="border p-3.5 rounded-2xl border-slate-200">
      <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="currentColor"><rect fill="none" height="24" width="24"></rect><path d="M2,19.99l7.5-7.51l4,4l7.09-7.97L22,9.92l-8.5,9.56l-4-4l-6,6.01L2,19.99z M3.5,15.49l6-6.01l4,4L22,3.92l-1.41-1.41 l-7.09,7.97l-4-4L2,13.99L3.5,15.49z"></path></svg>
    </div>

    <div class="font-bold">
      <span class="text-base font-bold">
        {$_('ready_to_grow_your_wealth')}
      </span>
    </div>
    <div>
      <button class="h-[40px] bg-slate-800 rounded-full no-animation hover:bg-slate-800" data-testid="create-new-market-making" on:click={()=>goto('/grow/market_making/new/easy/one')}>
        <span class="text-slate-50 text-sm mx-4">
          {$_('start_market_making')}
        </span>
      </button>
    </div>
  </div>
{:else}
  <div class="mx-6">
    <div>
      
    </div>  
  </div>
{/if}