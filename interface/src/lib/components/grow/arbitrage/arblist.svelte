<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";

  const list = []
</script>

<!-- Zero arb created -->
{#if list.length === 0}
  <div class="flex flex-col grow mx-6 h-full justify-center items-center space-y-6">
    <div class="text-xs font-bold">
      <span class="text-sm font-bold">
        {$_('ready_to_grow_your_wealth')}
      </span>
    </div>
    <div>
      <button class="btn btn-md rounded-full bg-base-content no-animation" on:click={()=>goto('/grow/arbitrage/new')}>
        <span class="text-base-100">
          {$_('create_new_arbitrage')}
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


