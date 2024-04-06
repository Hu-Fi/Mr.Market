<script lang="ts">
  import moment from "moment";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";

  $: o = $page.data.order
  $: state = o ? o.state : 'ORDER_CREATED';
</script>

<div class="mx-4 flex flex-col space-y-4">
  <!-- Symbol -->
  <div class="flex items-center justify-center space-x-1">
    <img src={findExchangeIconByIdentifier(o.exchangeName)} alt="icon" class="w-5 h-5">
    <span class="font-bold"> {o.symbol} </span>
  </div>

  <!-- State -->
  <div class="flex items-center justify-center">
    <span class="text-sm">
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

  <!-- More -->
  <div class="flex flex-col space-y-4 text-xs pt-3">
    <div class="flex justify-between">
      <span class="opacity-60"> {$_('type')} </span>
      <span class="font-bold"> {o.type} </span>
    </div>

    <div class="flex justify-between">
      <span class="opacity-60"> {$_('price')} </span>
      <span class="font-bold"> {o.price} </span>
    </div>

    <div class="flex justify-between">
      <span class="opacity-60"> {$_('exchange')} </span>
      <span class="font-bold"> {o.exchangeName} </span>
    </div>

    <div class="flex justify-between">
      <span class="opacity-60"> {$_('paid')} </span>
      <span class="font-bold"> {o.amount} </span>
    </div>

    <div class="flex justify-between">
      <span class="opacity-60"> {$_('recipient')} </span>
      <span class="font-bold"> {$_('mixin_wallet')} </span>
    </div>

    <div class="flex justify-between">
      <span class="opacity-60"> {$_('created_at')} </span>
      <span class="font-bold"> {moment(o.createdAt).format('YYYY-MM-DD hh:mm')} </span>
    </div>

    <div class="flex justify-between">
      <span class="opacity-60"> {$_('updated_at')} </span>
      <span class="font-bold"> {moment(o.updatedAt).format('YYYY-MM-DD hh:mm')} </span>
    </div>
  </div>

  <!-- Type: Limit/Market -->
  <!-- Buy: Buy/Sell -->
  <!-- State: Success/Partially success/Canceled -->
  <!-- Amount -->
  <!-- Price -->
  <!-- Recipient account -->
  <!-- Created Time -->
  <!-- Finished Time -->
</div>
