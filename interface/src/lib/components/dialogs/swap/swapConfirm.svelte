<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
	import { BN, formatDecimals } from '$lib/helpers/utils';
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import {
    Input,
    InputAsset,
    Output,
    OutputAsset,
    SwapConfirmDialog,
  } from "$lib/stores/swap";

  $: details = [
    {
      name: $_("price"),
      key: "rate",
      value: `1 ${$InputAsset.symbol} = ${ formatDecimals(BN($Output).div(BN($Input)).toNumber(), 8) } ${$OutputAsset.symbol}`,
    },
    { name: $_("recipient"), key: "recipient", value: $_("mixin_wallet") },
  ];

  let swapLoading = false;
  const confirmSwap = () => {
    swapLoading = !swapLoading;
  }
</script>

<dialog
  id="swap_confirm_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$SwapConfirmDialog}
>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => SwapConfirmDialog.set(false)}></button>
  </form>
  <div class="modal-box space-y-10 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-4">
      <!-- Close -->
      <div class="flex justify-between">
        <span>
          {$_("confirm_swap")}
        </span>

        <button on:click={() => SwapConfirmDialog.set(false)} data-testid="swap_confirm_close">
          <!-- Close Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            /></svg
          >
        </button>
      </div>
    </div>

    <div class="flex items-center">
      <!-- From asset -->
      <div class="flex flex-col items-center justify-center w-full text-wrap">
        <AssetIcon
          assetIcon={$InputAsset.icon_url}
          chainIcon={$InputAsset.icon_url}
        />
        <span class="opacity-60 !text-[10px] mt-2">
          {$_("pay")}
        </span>
        <span class="text-base font-semibold text-center">
          {$Input}
        
          {$InputAsset.symbol}
        </span>
      </div>

      <!-- Arrow -->
      <div class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </div>

      <!-- To asset -->
      <div class="flex flex-col items-center justify-center w-full text-wrap">
        <AssetIcon
          assetIcon={$OutputAsset.icon_url}
          chainIcon={$OutputAsset.icon_url}
        />
        <span class="opacity-60 !text-[10px] mt-2">
          {$_("receive")}
        </span>
        <span class="text-base font-semibold text-center">
          {$Output}
          {$OutputAsset.symbol}
        </span>
      </div>
    </div>

    <!-- Details -->
    <div class="flex flex-col !mt-8 space-y-3 text-sm">
      {#each details as detail}
        <div class="flex w-full justify-between">
          <span class="opacity-60"> {detail.name} </span>
          <span> {detail.value} </span>
        </div>
      {/each}
    </div>

    <!-- Confirm -->
    <div class="w-full pb-4">
      <button class={clsx("btn btn-md px-0 w-full rounded-full bg-slate-800 hover:bg-slate-800 focus:bg-slate-800 no-animation")} on:click={confirmSwap} data-testid="swap_confirm_order">
        <span class={clsx("text-base-100 font-semibold", swapLoading && "loading loading-spinner")}> {$_('confirm_order')}</span>
      </button>
    </div>
  </div>
</dialog>
