<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { invalidate } from "$app/navigation";
  import {
    getGlobalFees,
    updateGlobalFees,
    getFeeOverrides,
  } from "$lib/helpers/hufi/admin/fee";
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

<div class="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
  <div class="space-y-1">
    <span class="text-3xl font-bold text-left">{$_("fees")}</span>
    <p class="text-base-content/60">{$_("manage_global_fees_and_overrides")}</p>
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
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Global Fees Section -->
      <div class="lg:col-span-1 space-y-6">
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body">
            <h2 class="card-title text-lg mb-4">{$_("global_fees")}</h2>

            <div class="form-control w-full">
              <label class="label">
                <span class="label-text font-medium">{$_("spot_fee")}</span>
              </label>
              <input
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
              <label class="label">
                <span class="label-text font-medium"
                  >{$_("market_making_fee")}</span
                >
              </label>
              <input
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
                on:click={async () => {
                  await UpdateGlobalFees(globalFee);
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
                class="btn btn-ghost btn-sm btn-circle"
                on:click={() => RefreshFees()}
              >
                <span
                  class={clsx(
                    isRefreshing && "loading loading-spinner loading-xs",
                  )}
                >
                  {#if !isRefreshing}
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
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>
                  {/if}
                </span>
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="table table-lg">
                <thead class="bg-base-200/50 text-base-content/70">
                  <tr>
                    <th>{$_("type")}</th>
                    <th>{$_("pair")}</th>
                    <th>{$_("custom_fee")}</th>
                    <th class="text-right">{$_("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {#if feeOverrides.length === 0}
                    <tr>
                      <td
                        colspan="4"
                        class="text-center py-12 text-base-content/40"
                      >
                        {$_("no_overrides_found")}
                      </td>
                    </tr>
                  {/if}

                  {#each feeOverrides as override}
                    <tr class="hover:bg-base-200/30 transition-colors">
                      <td>
                        {#if override.type === "spot"}
                          <div
                            class="badge badge-secondary badge-outline badge-sm"
                          >
                            SPOT
                          </div>
                        {:else}
                          <div
                            class="badge badge-accent badge-outline badge-sm"
                          >
                            MM
                          </div>
                        {/if}
                      </td>
                      <td class="font-medium font-mono">{override.symbol}</td>
                      <td>
                        <span class="badge badge-primary badge-sm"
                          >{override.fee_rate}</span
                        >
                      </td>
                      <td class="text-right">
                        <a
                          href={override.type === "spot"
                            ? "/manage/settings/spot-trading"
                            : "/manage/settings/market-making"}
                          class="btn btn-xs btn-ghost gap-1"
                        >
                          {$_("manage")}
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
                        </a>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
