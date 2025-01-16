<script>
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import SingleArbitrage from "./singleArbitrage.svelte";

  let orders = [];
</script>

<div class="overflow-x-auto">
  <div class="flex items-center">
    <button class="btn btn-xs btn-ghost hover:bg-base-100" on:click={()=>{
      //goto('/manage/orders/arbitrage')
    }}>
      <span class="font-semibold text-base"> {$_('arbitrage')} </span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
        <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
      </svg>      
    </button>
  </div>
  {#if orders.length === 0}
    <div class="py-16 flex justify-center">
      <span class="text-base-content">
        {$_("no_result_found")}
      </span>
    </div>
  {:else}
    <table class="table mt-4">
      <!-- head -->
      <thead>
        <tr>
          <th>{$_("exchange")}</th>
          <th>{$_("type")}</th>
          <th>{$_("symbol")}</th>
          <th>{$_("amount")}</th>
          <th>{$_("state")}</th>
          <th>{$_("user_id")}</th>
          <th>{$_("order_id")}</th>
          <th>{$_("time")}</th>
          </tr>
        </thead>
        <tbody>
          {#each orders as order}
            <SingleArbitrage {order} />
          {/each}
        </tbody>
    </table>
  {/if}
</div>
