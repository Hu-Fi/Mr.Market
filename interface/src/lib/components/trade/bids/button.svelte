<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { DownColorBg, UpColorBg } from "$lib/helpers/constants";
  import { amount, buy, orderConfirmDialog, pair } from "$lib/stores/trade";

  const confirm = () => {
    if (!$amount) { console.log('enter amount'); return}
    orderConfirmDialog.set(true)
  }
</script>

<div>
  <button class={clsx("btn btn-md h-[2.5rem] min-h-[2.5rem] no-animation text-center w-full rounded-full text-base-100 font-extrabold", $buy ? `${UpColorBg} !hover:${UpColorBg} focus:${UpColorBg}` : `${DownColorBg} !hover:${DownColorBg} focus:${DownColorBg}`)} on:click={confirm} data-testid="confirm_order">
    {#if $buy}
      <span> {$_('buy')} {$pair.first} </span>
    {:else}
      <span> {$_('sell')} {$pair.first} </span>
    {/if}
  </button>
</div>
