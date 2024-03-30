<script lang="ts">
  import moment from "moment";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";

  $page.data.order;

  const o = {
    orderId: "a22170a7-ec32-4718-80f7-c304959c3e42",
    snapshotId: "d6db8dd2-089c-49df-9df7-01f810d00c27",
    userId: "5da31e04-9a35-43d1-b46f-a6960bcd8e2d",
    exchangeName: "okx",
    type: "Limit Buy",
    state: "ORDER_CREATED",
    symbol: "BTC/USDT",
    baseAssetId: "c6d0c728-2624-429b-8e0d-d9d19b6592fa",
    targetAssetId: "43d61dcd-e413-450d-80b8-101d5e903357",
    createdAt: "2019-10-12T07:20:50.52Z",
    updatedAt: "2019-10-12T07:20:50.52Z",
    amount: '123.123',

    price: 43576,
    // symbol: "",
    // buy: true,
  };
</script>

<div class="mx-4 flex flex-col space-y-3">
  <!-- Symbol -->
  <div class="flex items-center justify-center space-x-1">
    <img src={findExchangeIconByIdentifier(o.exchangeName)} alt="icon" class="w-5 h-5">
    <span class="font-bold"> {o.symbol} </span>
  </div>

  <!-- State -->
  <div class="flex items-center justify-center">
    <span class="text-xs">
      {o.state}
    </span>
  </div>

  <!-- More -->
  <div class="flex flex-col space-y-6 text-xs pt-3">
    <div class="flex justify-between">
      <span class="opacity-60"> {$_('type')} </span>
      <span class="font-bold"> {o.type} </span>
    </div>

    <div class="flex justify-between">
      <span class="opacity-60"> {$_('amount')} </span>
      <span class="font-bold"> {o.amount} </span>
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
