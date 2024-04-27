<script lang="ts">
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";

  const list = []
</script>

<!-- Zero mm created -->
{#if list.length === 0}
  <div class="flex flex-col grow mx-6 h-full justify-center items-center space-y-6 mb-24">
    <div class="text-xs font-bold">
      <span class="text-sm font-bold">
        {$_('ready_to_grow_your_wealth')}
      </span>
    </div>
    <div>
      <button class="btn btn-md rounded-full bg-slate-800 no-animation hover:bg-slate-800" on:click={()=>goto('/grow/auto_invest/new/one')}>
        <span class="text-base-100">
          {$_('start_auto_invest')}
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


