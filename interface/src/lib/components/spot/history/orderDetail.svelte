<script lang="ts">
  import moment from "moment";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import canceledSrc from "$lib/images/order/canceled.svg";
  import waitingSrc from "$lib/images/order/waiting.svg";
  import successSrc from "$lib/images/order/success.svg";
  import mixinSrc from "$lib/images/order/mixin.svg";
  import copySrc from "$lib/images/order/copy.svg";
  import toast from 'svelte-french-toast';
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import clsx from "clsx";
  import { orderDetails, orderDetailsStatus } from "$lib/stores/spot";
  import OrderDetailLoader from "./orderDetailLoader.svelte"
  import type { SpotOrderDetails } from "$lib/types/hufi/spot_details";

  $: o = $orderDetails as SpotOrderDetails | undefined;
  $: orderId = $page.data.orderId;
  $: state = o ? o.state : 'ORDER_CREATED';
  $: stateIcon = [
    {
      src: canceledSrc,
      alt: 'Order canceled',
      forStates: [],
    },
    {
      src: waitingSrc,
      alt: 'Order waiting',
      forStates: ['EXCHANGE_ORDER_FILLED', 'EXCHANGE_ORDER_PARTIAL_FILLED', 'EXCHANGE_ORDER_PLACED', 'ORDER_CREATED'],
    },
    {
      src: successSrc,
      alt: 'Order completed',
      forStates: ['ORDER_SUCCESS'],
    },
  ].find((stateIcon) => stateIcon.forStates.includes(state))
</script>
{#if $orderDetailsStatus === 'loading'}
  <OrderDetailLoader />
{/if}
{#if $orderDetailsStatus === 'error'}
  <div class="p-5 m-auto max-w-44">{$_('order_not_found')}</div>
{/if}
{#if o && $orderDetailsStatus === 'success'}
<div class="flex flex-col space-y-4">
  <div class="py-4 my-4 bg-gray-100">
    <!-- Symbol -->
    <div class="flex items-center justify-center space-x-1">
      <span class="font-bold"> {o.symbol} </span>
    </div>
    <!-- State -->
    <div class="flex items-center justify-center">
    <span class="font-bold mt-2">
      {#if stateIcon}
        <img src={stateIcon.src} alt={stateIcon.alt} class="inline-block mr-0.5" />
      {/if}
      {#if state == 'ORDER_CREATED'}
        {$_('order_created')}
      {:else if state == 'EXCHANGE_ORDER_PLACED'}
        {$_('order_placed')}
      {:else if state == 'EXCHANGE_ORDER_PARTIAL_FILLED'}
        {$_('order_partially_filled')}
      {:else if state == 'EXCHANGE_ORDER_FILLED'}
        {$_('order_filled')}
      {:else if state == 'ORDER_SUCCESS'}
        {$_('order_success')}
      {/if}
    </span>
    </div>
  </div>
  <div class="max-w-24rem flex flex-col rounded-xl border border-base-200 relative">
    <!-- More -->
    <div class="flex flex-col space-y-3 text-xs">
      <div class="flex justify-between">
        <span class="font-bold"> {$_('order_id')} </span>
        <button
          type="button"
          class="opacity-60 cursor-pointer"
          title={$_('copy_to_clipboard')}
          on:click={() => {
            navigator.clipboard.writeText(orderId);
            toast.success($_('order_id_copied_to_clipboard'));
          }}
        > {orderId} <img class="inline-block" src={copySrc} alt={$_('copy_url')}/></button>
      </div>
      <hr/>
      <div class="flex justify-between">
        <span class="font-bold"> {$_('type')} </span>
        <span class={clsx("font-bold", (o.type[1] || '') === 'S' ? 'text-red-400' : 'text-green-400')}>
          {o.type}
        </span>
      </div>
      <hr/>
      <div class="flex justify-between">
        <span class="font-bold"> {$_('exchange')} </span>
        <span class="opacity-60"> <img src={findExchangeIconByIdentifier(o.exchangeName)} alt={`${findExchangeIconByIdentifier(o.exchangeName)} icon`} class="inline-block w-3 h-3">
          {o.exchangeName.toUpperCase()} </span>
      </div>
      <hr/>
      <div class="flex justify-between">
        <span class="font-bold"> {$_('order_filled_amount')} </span>
        <span class="opacity-60"> {o.filled || ''}{`${o.amount ? '/' : ''}`}{o.amount || ''} </span>
      </div>
      <hr/>
      <div class="flex justify-between">
        <span class="font-bold"> {$_('order_avg_price')} </span>
        <span class="opacity-60"> {o.avg || ''}{`${o.price ? '/' : ''}`}{o.price || ''} </span>
      </div>
      <hr/>
      <div class="flex justify-between">
        <span class="font-bold"> {$_('pay')} </span>
        <span class="opacity-60">{o.pay || ''}</span>
      </div>
      <hr/>
      <div class="flex justify-between">
        <span class="font-bold"> {$_('fee')} </span>
        <span class="opacity-60">{o.fee || ''}</span>
      </div>
      <hr/>
      <div class="flex justify-between">
        <span class="font-bold"> {$_('receive')} </span>
        <span class="opacity-60">{o.receive || ''}</span>
      </div>
      <hr/>
      <div class="flex justify-between">
        <span class="font-bold"> {$_('receiving_account')} </span>
        <span class="opacity-60"> <img src={mixinSrc} class="inline-block" alt={$_('mixin_wallet_icon')} /> {$_('mixin_wallet')} </span>
      </div>
      <hr/>
      <div class="flex justify-between">
        <span class="font-bold"> {$_('time_created')} </span>
        <span class="opacity-60"> {moment(o.createdAt).format('YYYY/MM/DD hh:mm')} </span>
      </div>
      <hr/>
      <div class="flex justify-between">
        <span class="font-bold"> {$_('time_updated')} </span>
        <span class="opacity-60"> {moment(o.updatedAt).format('YYYY/MM/DD hh:mm')} </span>
      </div>
    </div>
  </div>
</div>
{/if}
<style>
  .max-w-24rem {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    max-width: 24rem;
  }
  hr {
    border-top: 1px solid #eeeeee;
  }
  div.bg-gray-100 {
    background-color: #F8FAFC;
  }
</style>
