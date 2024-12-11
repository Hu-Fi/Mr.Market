<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { ArbitrageCreatePay } from "$lib/helpers/mixin";
  import { getUuid } from "@mixin.dev/mixin-node-sdk";
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import { getMixinTx, getOrderPaymentState } from "$lib/helpers/hufi/strategy";
  import { createArbAmount, createArbConfirmDialog, createArbPair, createSimplyGrowRewardAddress } from "$lib/stores/grow"
  import { ORDER_STATE_FETCH_INTERVAL, ORDER_STATE_TIMEOUT_DURATION } from "$lib/helpers/constants";

  $: baseAssetSymbol = $createArbPair ? $createArbPair.base_symbol : ''
  $: baseAssetAmount = $createArbAmount[0]
  $: targetAssetSymbol = $createArbPair ? $createArbPair.target_symbol : ''
  $: targetAssetAmount = $createArbAmount[1]

  let btn1Loading = false;
  let btn2Loading = false;
  let btn1Paid = false;
  let btn2Paid = false;
  let checkOrderCreationStarted = false;
  let orderId = getUuid();
  let mixinTraceId1 = '';
  let mixinTraceId2 = '';

  const checkPaymentState = async (traceId: string, base: boolean) => {
    let totalTime = 0;
    var interval = setInterval(async () => {
      const state = await getMixinTx(traceId);
      if (state.error) {
        return;
      }
      if (state.data.state === 'spent') {
        if (base) {
          btn1Loading = false;
          btn1Paid = true;
        } else {
          btn2Loading = false;
          btn2Paid = true;
        }
        clearInterval(interval);
      }
      if (btn1Paid && btn2Paid && !checkOrderCreationStarted) {
        checkOrderCreation(orderId);
        checkOrderCreationStarted = true;
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
    if (btn1Paid && btn2Paid) {
      var OrderCreationInterval = setInterval(async () => {
        const state = await getOrderPaymentState(orderId);
        if (state.data.firstSnapshotId && state.data.secondSnapshotId) {
          clearInterval(OrderCreationInterval);
          goto(`/grow/arbitrage/${orderId}`);
        }
        totalTime += ORDER_STATE_FETCH_INTERVAL;
        if (totalTime >= ORDER_STATE_TIMEOUT_DURATION) {
          clearInterval(OrderCreationInterval);
        }
      }, ORDER_STATE_FETCH_INTERVAL);
      return;
    }
  }

  const payment = (type: string) => {
    if (type === '1') {
      btn1Loading = true;
      mixinTraceId1 = ArbitrageCreatePay({
        action: 'create', 
        rewardAddress: $createSimplyGrowRewardAddress,
        amount: baseAssetAmount,
        assetId: $createArbPair.base_asset_id,
        firstAssetId: $createArbPair.base_asset_id,
        secondAssetId: $createArbPair.target_asset_id,
        arbitragePairId: $createArbPair.id,
        orderId,
      })
    }
    if (type === '2') {
      btn2Loading = true;
      mixinTraceId2 = ArbitrageCreatePay({
        action: 'create', 
        rewardAddress: $createSimplyGrowRewardAddress,
        amount: targetAssetAmount,
        assetId: $createArbPair.target_asset_id,
        firstAssetId: $createArbPair.base_asset_id,
        secondAssetId: $createArbPair.target_asset_id,
        arbitragePairId: $createArbPair.id,
        orderId,
      })
    }
    if (btn1Loading) {
      checkPaymentState(mixinTraceId1, true);
    }
    if (btn2Loading) {
      checkPaymentState(mixinTraceId2, false);
    }
  }
</script>

<dialog
  id="confirm_arb_payment_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$createArbConfirmDialog}
>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-4">
      <!-- Title -->
      <div class="flex justify-between">
        <span class="font-semibold"> {$_("confirm_payment")} </span>
        <button on:click={() => createArbConfirmDialog.set(false)}>
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
      <div class="flex flex-col text-center space-y-4">
        <!-- Infos -->
        <div class="flex flex-col space-y-6 my-8 mb-4">
          <div class="flex justify-between">
            <div class="flex items-center space-x-3">
              <img src={findCoinIconBySymbol(baseAssetSymbol)} class="w-6 h-6" alt="" />
              <span class="font-bold"> {baseAssetAmount} {baseAssetSymbol} </span>
            </div>
            <div class="flex">
              <button 
                class={
                  clsx("btn btn-xs bg-slate-800 text-base-100 rounded-full !h-[2rem]", 
                  "hover:bg-slate-800 no-animation")
                } 
                on:click={()=>{ payment('1') }}
                data-testid='pay-btn-1'
              >
                {#if !btn1Paid}
                  <span class={clsx("mx-2", btn1Loading && "loading loading-sm")}>
                    {$_('pay')}
                  </span>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5 mx-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                {/if}
              </button>
            </div>
          </div>

          <div class="flex justify-between"> 
            <div class="flex items-center space-x-3">
              <img src={findCoinIconBySymbol(targetAssetSymbol)} class="w-6 h-6" alt="" />
              <span class="font-bold"> {targetAssetAmount} {targetAssetSymbol} </span>
            </div>
            <div class="flex">
              <button class="btn btn-xs bg-slate-800 text-base-100 rounded-full !h-[2rem] hover:bg-slate-800 no-animation"
                on:click={()=>{ payment('2') }}
                data-testid='pay-btn-2'
              >
                {#if !btn2Paid}
                  <span class={clsx("mx-2", btn2Loading && "loading loading-sm")}>
                    {$_('pay')}
                  </span>
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5 mx-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                {/if}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <form method="dialog" class="modal-backdrop">
    <button on:click={() => createArbConfirmDialog.set(false)}></button>
  </form> -->
</dialog>