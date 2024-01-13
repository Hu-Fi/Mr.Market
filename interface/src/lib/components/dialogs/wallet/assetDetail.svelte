<script lang="ts">
  import { _ } from "svelte-i18n";
  import { assetDetailDialog, assetDetailAsset } from "$lib/stores/wallet";
	import History from '$lib/components/wallet/balance/details/history.svelte';
	import Actions from '$lib/components/wallet/balance/details/actions.svelte';
	import Exit from '$lib/components/wallet/balance/details/exit.svelte';
	import Title from '$lib/components/wallet/balance/details/title.svelte';
</script>

{#if $assetDetailAsset}
  <dialog
    id="order_confirm_modal"
    class="modal modal-bottom sm:modal-middle backdrop-blur-sm"
    class:modal-open={$assetDetailDialog}
  >
    <form method="dialog" class="modal-backdrop">
      <button on:click={() => assetDetailDialog.set(false)}></button>
    </form>
    <div class="modal-box space-y-6 px-0 pt-5">
      <Exit />
      
      <Title />

      <Actions />
      
      <!-- <div class="!my-0 border-t-[10px] border-slate-100 mb-36" /> -->
      <!-- <History /> -->
    </div>      
  </dialog>
{/if}
