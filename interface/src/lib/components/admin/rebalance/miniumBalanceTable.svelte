<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { fetchMiniumBalanceSettings, fetchRebalanceExchanges } from "$lib/helpers/hufi/admin/minBalances";

  let exchanges: string[] = [];
  let table: unknown[] = [];

  const fetchData = async () => {
    const token = localStorage.getItem("admin-access-token");
    if (!token) {
      console.error("Unable to fetch admin endpoint without jwt token");
      return;
    }
    exchanges = await fetchRebalanceExchanges(token);
    return await fetchMiniumBalanceSettings(token);
  };
  (async () => {
    table = await fetchData();
    console.log(table)
  })();
</script>

<div class="overflow-x-auto flex flex-col space-y-4">
  <div class="flex items-center">
    <span class="font-semibold text-base">
      {$_("minimum_balance_settings")}
    </span>
    <button
      class="btn btn-xs btn-ghost hover:bg-base-100 no-animation flex items-center"
      on:click={() => {
        goto("/manage/rebalance/new");
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-4 h-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </button>
  </div>
  {#if table.length != 0}
    <table class="table mt-4">
      <!-- head -->
      <thead>
        <tr>
          <th>{$_('symbol')}</th>
          <!-- <th>{$_('asset_id')}</th> -->
          {#each Object.values(exchanges) as exchange}
            <th>
              {exchange.name}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody> 
        {#each Object.values(table) as t}
          <tr>
            <td>
              {t.symbol}
            </td>
            <!-- <td>
              {t.asset_id}
            </td> -->
            <td>
              
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="m-32 !my-64 text-center">
      <span> {$_("no_result_found")} </span>
    </div>
  {/if}
</div>
