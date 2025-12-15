<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import {
    fetchMiniumBalanceSettings,
    fetchRebalanceExchanges,
  } from "$lib/helpers/mrm/admin/minBalances";

  const TEMPORARY_SKIP = true;

  let exchanges: any[] = [];
  let table: any[] = [];

  const fetchData = async () => {
    const token = localStorage.getItem("admin-access-token");
    if (!token) {
      console.error("Unable to fetch admin endpoint without jwt token");
      return;
    }
    exchanges = (await fetchRebalanceExchanges(token)) as any[];
    return await fetchMiniumBalanceSettings(token);
  };
  (async () => {
    table = (await fetchData()) as any[];
  })();
</script>

{#if !TEMPORARY_SKIP}
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
            <th>{$_("symbol")}</th>
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
              {#each t.exchange as e}
                <td>
                  <div class="input input-xs">
                    {e.name === exchanges[0].name ? e.minimumBalance : "-"}
                  </div>
                </td>
                <td>
                  <div class="input input-xs">
                    {e.name === exchanges[1].name ? e.minimumBalance : "-"}
                  </div>
                </td>
              {/each}
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
{:else}
  <div class="flex items-center justify-center">
    <span>
      We skip this for now as we can modifiy them through db. We don't have
      enough time for this (27 Mar)
    </span>
  </div>
{/if}
