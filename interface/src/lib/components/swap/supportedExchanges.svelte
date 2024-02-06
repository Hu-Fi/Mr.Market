<script lang="ts">
  import { _ } from "svelte-i18n"
  import { EXCHANGES, findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import { SupportedExchangesDialog } from "$lib/stores/swap";
</script>

<div class="mb-24 flex items-center justify-center text-xs">
  <button on:click={()=>{ SupportedExchangesDialog.set(true) }} data-testid='supported-exchanges' class="flex flex-col items-center space-y-1">
    <span class="opacity-40 text-xs">
      {$_('supported_exchanges')}
    </span>
    <div class="justify-center items-center avatar-group">
      {#each EXCHANGES as e}
        <div class="avatar">
          <div class="rounded-full w-5">
            <img src={findExchangeIconByIdentifier(e)} alt="" class="w-5 h-5 rounded-full">
          </div>
        </div>
      {/each}
    </div>
  </button>
</div>