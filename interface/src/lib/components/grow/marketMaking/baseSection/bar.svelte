<script lang="ts">
  import { goto } from "$app/navigation";
  import { _ } from "svelte-i18n";
</script>

<div class="flex items-center justify-between gap-2 m-2">
  <span class="font-semibold">
    {$_('market_making')}
  </span>

  <button class="flex flex-row items-center space-x-1" on:click={() => {
    goto('/market-making/create-new');
  }}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    <span class="text-sm">
      {$_('create_new')}
    </span>
  </button>
</div>