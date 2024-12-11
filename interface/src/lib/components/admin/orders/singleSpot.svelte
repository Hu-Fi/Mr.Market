<script lang="ts">
  import type { AdminSpotOrder } from "$lib/types/hufi/admin";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";

  export let order: AdminSpotOrder;
</script>

<tr on:click={() => {
  console.log(order);
}}>
  <td>
    <div class="flex items-center gap-2">
      <div class="avatar">
        <div class="mask mask-squircle w-6 h-6">
          <img src={findExchangeIconByIdentifier(order.exchange)} alt="" />
        </div>
      </div>
      <span class="capitalize"> {order.exchange} </span>
    </div>
  </td>
  <td>
    <div class="flex items-center gap-3">
      <div>
        <span class="capitalize">{order.type}</span>
      </div>
    </div>
  </td>
  <td>
    <span>
      {order.symbol}
    </span>
  </td>
  <td>
    <span>
      {order.amount}
    </span>
  </td>
  <td>
    <span>
      {order.state}
    </span>
  </td>
  <td>
    <span>
      {order.userID}
    </span>
  </td>
  <td>
    <span>
      {order.orderID}
    </span>
  </td>
  <td>
    {order.time}
  </td>
</tr>
