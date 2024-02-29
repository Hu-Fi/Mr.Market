<script lang="ts">
  import type { AdminSingleKey } from "$lib/types/hufi/admin";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  
  export let key: AdminSingleKey;
</script>

<div class="flex items-center justify-between p-4 border-b border-x first:border-t last:border-b">
  <div class="flex items-center space-x-4">
    <div class="avatar">
      <div class="mask mask-squircle w-8 h-8">
        <img src={findExchangeIconByIdentifier(key.exchange)} alt="" class="">
      </div>
    </div>
    <div class="flex flex-col">
      <span class="text-base capitalize font-semibold"> {key.exchange} </span>
      <span class="text-xs opacity-60 select-text"> {key.key} </span>
    </div>
  </div>
  
  <div class="flex flex-col items-end justify-center space-y-1">
    {#if key.state === 'alive'}
      <div class="badge badge-primary badge-outline capitalize">{key.state}</div>
    {:else}
      <div class="badge badge-error badge-outline capitalize">{key.state}</div>
    {/if}
    <div>
      <span class="text-xs opacity-60"> {key.last_update} </span>
    </div>
  </div>
</div>