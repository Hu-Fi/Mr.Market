<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { DownColorBg, UpColorBg } from "$lib/helpers/constants";
  import { buy, orderConfirmDialog, pair, orderTypeLimit, orderTypeMarket, limitTotal, marketAmount } from "$lib/stores/spot";
  import { userAssets } from "$lib/stores/wallet";
  import { formatWalletBalance } from "$lib/helpers/utils";
  import { mixinConnected } from "$lib/stores/home";
  import toast from "svelte-french-toast";

  const extractBalance = (symbol: string) => {
    const extractedData = $userAssets.balances.find((balance: { details: { symbol: string } }) => balance.details.symbol === symbol);
    if (!extractedData) {
      return 0;
    }
    return formatWalletBalance(extractedData.balance);
  };
  $: baseBalance = $mixinConnected && $userAssets ? extractBalance($pair.symbol.split('/')[1]) : 0;
  $: targetBalance = $mixinConnected && $userAssets ? extractBalance($pair.symbol.split('/')[0]) : 0;
  const fee = 1.2;

  const confirm = () => {
    if ($orderTypeLimit) {
      if (!$limitTotal) {
        toast.error('Enter total limit');
        return
      }
      if (($buy && $limitTotal * fee > baseBalance) || (!$buy && $limitTotal * fee > targetBalance)) {
        toast.error('Insufficient funds');
        return
      }
    }
    if ($orderTypeMarket) {
      if (!$marketAmount) {
        toast.error('Enter market amount');
        return
      }
      if (($buy && $marketAmount * fee > baseBalance) || (!$buy && $marketAmount * fee > targetBalance)) {
        toast.error('Insufficient funds');
        return
      }
    }
    orderConfirmDialog.set(true)
  }
</script>

<div>
  <button class={clsx("btn btn-md h-[2.5rem] min-h-[2.5rem] no-animation text-center w-full rounded-full text-base-100 font-extrabold", $buy ? `${UpColorBg} !hover:${UpColorBg} focus:${UpColorBg}` : `${DownColorBg} !hover:${DownColorBg} focus:${DownColorBg}`)} on:click={confirm} data-testid="confirm_order">
    {#if $buy}
      <span> {$_('buy')} {$pair.symbol.split('/')[0]} </span>
    {:else}
      <span> {$_('sell')} {$pair.symbol.split('/')[0]} </span>
    {/if}
  </button>
</div>
