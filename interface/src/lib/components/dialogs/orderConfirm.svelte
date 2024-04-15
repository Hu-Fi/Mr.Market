<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import {
    buy,
    orderConfirmDialog,
    pair,
    current,
    orderTypeLimit,
    limitPrice,
    limitTotal,
    limitAmount,
    orderTypeMarket,
    marketAmount,
    marketTotal,
    spotCreating,
  } from "$lib/stores/spot";
  import { SpotPay } from "$lib/helpers/mixin";
  import { getUuid } from "@mixin.dev/mixin-node-sdk";
  import { getOrderById } from "$lib/helpers/hufi/spot";
  import { ORDER_STATE_FETCH_INTERVAL, ORDER_STATE_TIMEOUT_DURATION} from "$lib/helpers/constants";
  import toast from "svelte-french-toast";
  import {formatFixedOrderBookPrice, formatUSNumber} from "$lib/helpers/utils";
  import BigNumber from "bignumber.js";
  const precisionLimit = () =>  Math.max(1, (`${formatUSNumber($limitPrice)}`.split('.')[1] || '').length);
  const precisionCurrent = () =>  Math.max(1, (`${formatUSNumber($current)}`.split('.')[1] || '').length);

  const fee = 0.2;
  $: limitPriceWithFee = $limitPrice ? formatFixedOrderBookPrice(Number($limitPrice) * fee, precisionLimit()) : $limitPrice;
  $: currentWithFee = $current ? formatFixedOrderBookPrice(Number($current) * fee, precisionCurrent()) : $current;
  $: infos = [
    {
      title: $_("payment_amount"),
      value: $orderTypeLimit ?
        $buy
          ? `${$limitTotal} ${$pair.symbol.split("/")[1]}`
          : `${$limitAmount} ${$pair.symbol.split("/")[0]}`
      : $orderTypeMarket ?
        $buy
          ? `${$marketAmount} ${$pair.symbol.split("/")[1]}`
          : `${$marketAmount} ${$pair.symbol.split("/")[0]}`
      : ''
    },
    {
      title: $_("fee"),
      value: $orderTypeLimit ?
        $buy
          ? `${$limitTotal ? BigNumber($limitTotal).multipliedBy(fee).toNumber() : 0} ${$pair.symbol.split("/")[1]}`
          : `${$limitAmount ? BigNumber($limitAmount).multipliedBy(fee).toNumber() : 0} ${$pair.symbol.split("/")[0]}`
        : $orderTypeMarket ?
          $buy
            ? `${$marketAmount ? BigNumber($marketAmount).multipliedBy(fee).toString() : 0} ${$pair.symbol.split("/")[1]}`
            : `${$marketAmount ? BigNumber($marketAmount).multipliedBy(fee).toString() : 0} ${$pair.symbol.split("/")[0]}`
          : ''
    },
    {
      title: $_("estimated_price"),
      value: $orderTypeLimit ?
        $buy
          ? limitPriceWithFee : limitPriceWithFee
      : $orderTypeMarket ?
        $buy
          ? currentWithFee : currentWithFee
      : ''
    },
    { title: $_("recipient"), value: $_("mixin_wallet") },
  ];

  const confirmPayment = () => {
    spotCreating.set(true);
    let payAmount: number | '' = 0;
    if ($orderTypeLimit) {
      if ($buy) {
        payAmount = $limitTotal;
      } else {
        payAmount = $limitAmount;
      }
    }
    if ($orderTypeMarket) {
      if ($buy) {
        payAmount = $marketAmount;
      } else {
        payAmount = $marketAmount;
      }
    }
    const trace = getUuid();

    SpotPay({
      limit: $orderTypeLimit,
      buy: $buy,
      symbol: $pair.symbol,
      exchange: $pair.exchange,
      price: String($limitPrice),
      amount: payAmount ? String(payAmount * 1.2) : '',
      trace
    })


    let found = false;
    let totalTime = 0;

    var interval = setInterval(async () => {
      console.log(`${new Date()} called`);
      // TODO: TEST IT;
      found = await getOrderById(trace);
      totalTime += ORDER_STATE_FETCH_INTERVAL;

      if (found) {
        clearInterval(interval);
        orderConfirmDialog.set(false);
        goto(`/spot/history/${trace}`);
      } else if (totalTime >= ORDER_STATE_TIMEOUT_DURATION) {
        clearInterval(interval);
        toast.error('Timeout. Your order was still not created.')
        console.log('Timeout reached, stopping execution.');
      }
    }, ORDER_STATE_FETCH_INTERVAL);

    setTimeout(() => {
      spotCreating.set(false);
    }, 1000 * 60 * 3);
  };
</script>

<dialog
  id="order_confirm_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$orderConfirmDialog}
>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-4">
      <!-- Title -->
      <div class="flex justify-between">
        <span class="font-semibold"> {$_("confirm_order")} </span>
        <button on:click={() => orderConfirmDialog.set(false)}>
          <!-- Close Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
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

      <!-- Estimate receive -->
      <div class="h-40 flex flex-col justify-center text-center space-y-2">
        <span class="text-xs opacity-60">
          {$_("estimated_receive")}
        </span>
        <span class="text-3xl font-bold">
          {#if $orderTypeLimit}
            {$buy ? $limitAmount : $limitTotal}
            {$buy ? $pair.symbol.split("/")[0] : $pair.symbol.split("/")[1]}
          {:else if $orderTypeMarket}
            {$marketTotal}
            {$buy ? $pair.symbol.split("/")[0] : $pair.symbol.split("/")[1]}
          {/if}
        </span>
      </div>

      <!-- Infos -->
      <div class="flex flex-col space-y-4 my-2 mb-4">
        {#each infos as info, i}
          <div class="flex justify-between text-sm">
            <span class="text-base-content/60">
              {info.title}
            </span>

            {#if i === 0}
              <!-- Payment Amount -->
              <span>
                {info.value}
              </span>
            {:else if i === 2}
              <!-- Exchange price -->
              <span>
                1 {$pair.symbol.split("/")[0]} = {info.value}
                {$pair.symbol.split("/")[1]}
              </span>
            {:else}
              <span>
                {info.value}
              </span>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Button -->
      <div class="w-full py-4 mb-4">
        <button
          class={clsx(
            "btn btn-md w-full rounded-full bg-base-content hover:bg-base-content focus:bg-base-content no-animation",
          )}
          on:click={confirmPayment}
        >
          <span
            class={clsx(
              "text-base-100 font-semibold",
              $spotCreating && "loading loading-spinner",
            )}
          >
            {$_("confirm_order")}</span
          >
        </button>
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => orderConfirmDialog.set(false)}></button>
  </form>
</dialog>
