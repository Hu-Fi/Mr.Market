<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { goto } from "$app/navigation";
  import { getUuid } from "@mixin.dev/mixin-node-sdk";
  import { SimplyGrowCreatePay } from "$lib/helpers/mixin";
  import { getMixinTx, getSimplyGrowDetailsById } from "$lib/helpers/hufi/strategy";
  import { ORDER_STATE_FETCH_INTERVAL, ORDER_STATE_TIMEOUT_DURATION } from "$lib/helpers/constants";
  import { createSimplyGrowAmount, createSimplyGrowAsset, createSimplyGrowConfirmDialog, createSimplyGrowRewardAddress } from "$lib/stores/grow";

  let loading = false;
  let paymentSuccessful = false;
  const orderId = getUuid();
  let mixinTraceId = '';

  const confirmPayment = () => {
    loading = true;
    mixinTraceId = SimplyGrowCreatePay({
      assetId: $createSimplyGrowAsset.asset_id,
      amount: $createSimplyGrowAmount,
      orderId,
      rewardAddress: $createSimplyGrowRewardAddress,
    });

    if (mixinTraceId) {
      console.log('mixinTraceId: ', mixinTraceId);
      checkPaymentState(mixinTraceId);
    }
  }

  const checkPaymentState = async (traceId: string) => {
    let totalTime = 0;
    const interval = setInterval(async () => {
      const state = await getMixinTx(traceId);
      if (state.error) {
        return;
      }
      if (state.data.state === 'spent') {
        loading = false;
        paymentSuccessful = true;
        clearInterval(interval);
        checkOrderCreation(orderId);
      }
      totalTime += ORDER_STATE_FETCH_INTERVAL;
      if (totalTime >= ORDER_STATE_TIMEOUT_DURATION) {
        clearInterval(interval);
      }
    }, ORDER_STATE_FETCH_INTERVAL);
  }

  const checkOrderCreation = async (orderId: string) => {
    // When both payments are successful, check if the order is created, then redirect to the order page
    let totalTime = 0;
    if (paymentSuccessful) {
      var OrderCreationInterval = setInterval(async () => {
        const order = await getSimplyGrowDetailsById(orderId);
        if (order.state) {
          clearInterval(OrderCreationInterval);
          goto(`/grow/simply_grow/${orderId}`);
        }
        totalTime += ORDER_STATE_FETCH_INTERVAL;
        if (totalTime >= ORDER_STATE_TIMEOUT_DURATION) {
          clearInterval(OrderCreationInterval);
        }
      }, ORDER_STATE_FETCH_INTERVAL);
      return;
    }
  }
</script>

<dialog
  id="confirm_simply_grow_payment_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$createSimplyGrowConfirmDialog}
>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-4 space-y-8">
      <!-- Title -->
      <div class="flex justify-between">
        <span class="font-semibold"> {$_("confirm_payment")} </span>
        <button on:click={() => createSimplyGrowConfirmDialog.set(false)}>
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
      <div class="h-28 flex flex-col justify-center text-center space-y-2">
        <span class="text-xs opacity-60">
          {$_("payment_amount")}
        </span>
        <span class="text-3xl font-bold">
          {$createSimplyGrowAmount} {$createSimplyGrowAsset ? $createSimplyGrowAsset.symbol : ''}
        </span>
      </div>

      <!-- Button -->
      <div class="w-full py-4">
        <button
          class={clsx(
            "btn btn-md w-full rounded-full bg-slate-800 hover:bg-slate-800 focus:bg-slate-800 no-animation",
          )}
          data-testid='confirm-order-btn'
          on:click={confirmPayment}
        >
          <span
            class={clsx(
              "text-base-100 font-semibold",
              loading && "loading loading-spinner",
            )}
          >
            {$_("confirm_order")}</span
          >
        </button>
      </div>
    </div>
  </div>
  <!-- <form method="dialog" class="modal-backdrop">
    <button on:click={() => createSimplyGrowConfirmDialog.set(false)}></button>
  </form> -->
</dialog>
