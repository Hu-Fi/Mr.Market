<script lang="ts">
  import { _ } from "svelte-i18n"
  import { EXCHANGES, findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import { SupportedExchangesDialog } from "$lib/stores/swap";
</script>

<dialog
  id="supported_exchanges_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$SupportedExchangesDialog}
>
  <div class="modal-box space-y-3 pt-0 px-5">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-6">

      <div class="flex flex-col space-y-6">
        <div class="flex items-center justify-between">
          <div class="py-1">
            <span class="font-semibold"> {$_('supported_exchanges')} </span>
          </div>
          
          <button on:click={()=>{SupportedExchangesDialog.set(false)}}>
            <!-- Close Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-2 gap-6">
          {#each EXCHANGES as e}
            <div class="flex space-x-3 items-center">
              <div class="avatar">
                <div class="rounded-full w-8">
                  <img src={findExchangeIconByIdentifier(e)} alt="" class="w-8 h-8 rounded-full">
                </div>
              </div>

              <div>
                <span class="font-normal capitalize"> {e} </span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => SupportedExchangesDialog.set(false)}></button>
  </form>
</dialog>
