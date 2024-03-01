<script lang="ts">
	import emptyToken from '$lib/images/empty-token.svg';
  import { findCoinIconBySymbol } from "$lib/helpers/helpers";
  import type { AdminSwapOrder } from "$lib/types/hufi/admin";

  export let order: AdminSwapOrder;
</script>

<tr>
  <td>
    <div class="flex items-center gap-2">
      <div class="avatar">
        <div class="mask mask-squircle w-6 h-6">
          <img src={findCoinIconBySymbol(order.base) || emptyToken} alt="" />
        </div>
      </div>
      <span class="capitalize"> {order.base} </span>
    </div>
  </td>
  <td>
    <div class="flex items-center gap-3">
      <div class="avatar">
        <div class="mask mask-squircle w-6 h-6">
          <img src={findCoinIconBySymbol(order.target) || emptyToken} alt="" />
        </div>
      </div>
      <span class="capitalize">{order.target}</span>
    </div>
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
      {order.time}
    </span>
  </td>
</tr>
