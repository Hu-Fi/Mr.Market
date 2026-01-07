<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {
    getGlobalFees,
    updateGlobalFees,
    getFeeOverrides,
  } from "$lib/helpers/mrm/admin/fee";
  import Loading from "$lib/components/common/loading.svelte";

  let globalFee: any = null;
  let feeOverrides: any[] = [];
  let isLoading = true;
  let isRefreshing = false;
  let isUpdating = false;

  async function RefreshFees() {
    if (!globalFee) isLoading = true;
    else isRefreshing = true;

    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    try {
      const [fees, overridesData] = await Promise.all([
        getGlobalFees(token),
        getFeeOverrides(token),
      ]);
      globalFee = fees;
      feeOverrides = overridesData;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading = false;
      isRefreshing = false;
    }
  }

  async function UpdateGlobalFees(fees: any) {
    isUpdating = true;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    try {
      await updateGlobalFees(fees, token);
      await RefreshFees();
    } catch (e) {
      console.error(e);
    } finally {
      isUpdating = false;
    }
  }

  onMount(() => {
    RefreshFees();
  });
</script>

<div class="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <button
        on:click={() => window.history.back()}
        class="btn btn-ghost btn-circle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      <div class="flex flex-col text-start items-start justify-center">
        <h1 class="text-3xl font-bold">{$_("fees")}</h1>
        <p class="text-sm text-base-content/60">
          {$_("manage_global_fees_and_overrides")}
        </p>
      </div>
    </div>

    <button class="btn btn-square btn-outline" on:click={() => RefreshFees()}>
      <span class={clsx(isRefreshing && "loading loading-spinner loading-sm")}>
        {#if !isRefreshing}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        {/if}
      </span>
    </button>
  </div>

  {#if isLoading}
    <div class="flex justify-center">
      <Loading />
    </div>
  {:else if !globalFee}
    <div
      class="w-full h-64 flex flex-col justify-center items-center gap-4 text-base-content/40"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-12 h-12"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
      <p>{$_("failed_to_load_data")}</p>
      <button
        class="btn btn-sm btn-ghost"
        on:click={() => window.location.reload()}
      >
        {$_("reload")}
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Global Fees Section -->
      <div class="lg:col-span-1 space-y-6">
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body">
            <h2 class="card-title text-lg mb-4">{$_("global_fees")}</h2>

            <div class="form-control w-full">
              <label class="label" for="spot-fee-input">
                <span class="label-text font-medium">{$_("spot_fee")}</span>
              </label>
              <input
                id="spot-fee-input"
                type="text"
                class="input input-bordered w-full focus:input-primary transition-all"
                bind:value={globalFee.spot_fee}
              />
              <label class="label cursor-pointer justify-start gap-3 mt-2">
                <input
                  type="checkbox"
                  class="toggle toggle-primary toggle-sm"
                  bind:checked={globalFee.enable_spot_fee}
                />
                <span class="label-text">{$_("enable_spot_fee")}</span>
              </label>
            </div>

            <div class="divider my-2"></div>

            <div class="form-control w-full">
              <label class="label" for="market-making-fee-input">
                <span class="label-text font-medium"
                  >{$_("market_making_fee")}</span
                >
              </label>
              <input
                id="market-making-fee-input"
                type="text"
                class="input input-bordered w-full focus:input-primary transition-all"
                bind:value={globalFee.market_making_fee}
              />
              <label class="label cursor-pointer justify-start gap-3 mt-2">
                <input
                  type="checkbox"
                  class="toggle toggle-primary toggle-sm"
                  bind:checked={globalFee.enable_market_making_fee}
                />
                <span class="label-text">{$_("enable_market_making_fee")}</span>
              </label>
            </div>

            <div class="card-actions justify-end mt-6">
              <button
                class="btn btn-primary w-full"
                on:click={() => {
                  // @ts-ignore
                  document.getElementById("confirm_modal").showModal();
                }}
              >
                <span
                  class={clsx(
                    isUpdating && "loading loading-spinner loading-sm",
                  )}
                >
                  {$_("save_changes")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <dialog id="confirm_modal" class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">{$_("confirm_changes")}</h3>
          <p class="py-4">{$_("are_you_sure_update_fees")}</p>
          <div class="modal-action">
            <form method="dialog">
              <button class="btn">{$_("cancel")}</button>
              <button
                class="btn btn-primary"
                on:click={async () => {
                  await UpdateGlobalFees(globalFee);
                }}>{$_("confirm")}</button
              >
            </form>
          </div>
        </div>
      </dialog>

      <!-- Fee Overrides Section -->
      <div class="lg:col-span-2 space-y-6">
        <div
          class="card bg-base-100 shadow-sm border border-base-200 overflow-hidden"
        >
          <div class="card-body p-0">
            <div
              class="p-6 border-b border-base-200 flex justify-between items-center bg-base-200/30"
            >
              <div>
                <h2 class="card-title text-lg">{$_("fee_overrides")}</h2>
                <p class="text-xs text-base-content/60 mt-1">
                  {$_("pairs_with_custom_fee_rates")}
                </p>
              </div>
              <button
                class="btn btn-primary btn-sm gap-2"
                on:click={() => {
                  // @ts-ignore
                  document.getElementById("add_override_modal")?.showModal();
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
                {$_("add_new_override")}
              </button>
            </div>

            {#if feeOverrides.length === 0}
              <div
                class="flex flex-col items-center justify-center py-16 text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-12 h-12 text-base-content/20 mb-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                <p class="text-lg font-medium text-base-content/60">
                  {$_("no_overrides_found")}
                </p>
                <p class="text-sm text-base-content/40 mt-1">
                  {$_("no_custom_fee_overrides_configured")}
                </p>
              </div>
            {:else}
              <div class="overflow-x-auto">
                <table class="table table-lg">
                  <thead class="bg-base-200/50 text-base-content/70">
                    <tr>
                      <th class="uppercase text-xs font-semibold"
                        >{$_("type")}</th
                      >
                      <th class="uppercase text-xs font-semibold"
                        >{$_("pair")}</th
                      >
                      <th class="uppercase text-xs font-semibold"
                        >{$_("custom_fee")}</th
                      >
                      <th class="text-right uppercase text-xs font-semibold"
                        >{$_("actions")}</th
                      >
                    </tr>
                  </thead>
                  <tbody>
                    {#each feeOverrides as override}
                      <tr class="hover:bg-base-200/30 transition-colors">
                        <td>
                          {#if override.type === "spot"}
                            <div
                              class="badge badge-base-200 badge-outline badge-sm"
                            >
                              {$_("spot")}
                            </div>
                          {:else}
                            <div
                              class="badge badge-accent badge-outline badge-sm"
                            >
                              {$_("market_making")}
                            </div>
                          {/if}
                        </td>
                        <td class="font-medium font-mono">{override.symbol}</td>
                        <td>
                          <span class="badge badge-primary badge-sm"
                            >{override.custom_fee_rate}</span
                          >
                        </td>
                        <td class="text-right">
                          <button
                            on:click={() => {
                              goto(
                                override.type === "spot"
                                  ? "/manage/settings/spot-trading"
                                  : "/manage/settings/market-making",
                              );
                            }}
                            class="btn btn-xs btn-ghost gap-1"
                          >
                            <span class="text-xs">
                              {$_("manage")}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-3 h-3"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Override Dialog -->
    <dialog id="add_override_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{$_("add_new_override")}</h3>
        <p class="py-4 text-sm text-base-content/60">
          {$_("fee_overrides_managed_in_specific_pages")}
        </p>
        <div class="flex flex-col gap-3">
          <button
            class="btn btn-primary justify-start gap-3"
            on:click={() => {
              goto("/manage/settings/spot-trading");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
              />
            </svg>
            {$_("spot_trading")}
          </button>
          <button
            class="btn btn-accent justify-start gap-3"
            on:click={() => {
              goto("/manage/settings/market-making");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
            {$_("market_making")}
          </button>
        </div>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">{$_("close")}</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>{$_("close")}</button>
      </form>
    </dialog>
  {/if}
</div>
