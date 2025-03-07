<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { DownColorBg, UpColorBg } from "$lib/helpers/constants";
  import { buy, orderConfirmDialog, orderTypeLimit, orderTypeMarket, limitTotal, marketAmount, pairBaseSymbol } from "$lib/stores/spot";

  const confirm = () => {
    if ($orderTypeLimit) {
      if (!$limitTotal) {
        console.log('enter limit amount'); return
      }
    }
    if ($orderTypeMarket) {
      if (!$marketAmount) {
        console.log('enter market amount'); return
      }
    }
    orderConfirmDialog.set(true)
  }
</script>

<div>
  <button class={clsx("btn btn-md h-[2.5rem] min-h-[2.5rem] no-animation text-center w-full rounded-full text-base-100 font-extrabold", $buy ? `${UpColorBg} !hover:${UpColorBg} focus:${UpColorBg}` : `${DownColorBg} !hover:${DownColorBg} focus:${DownColorBg}`)} on:click={confirm} data-testid="confirm_order">
    {#if $buy}
      <span> {$_('buy')} {$pairBaseSymbol} </span>
    {:else}
      <span> {$_('sell')} {$pairBaseSymbol} </span>
    {/if}
  </button>
</div>
