<script lang="ts">
    import clsx from "clsx";
    import { createEventDispatcher } from "svelte";
    import { _ } from "svelte-i18n";
    import toast from "svelte-french-toast";
    import type {
        MarketMakingPair,
        MarketMakingPairDto,
    } from "$lib/types/hufi/grow";
    import {
        updateMarketMakingPair,
        removeMarketMakingPair,
    } from "$lib/helpers/mrm/admin/growdata";

    export let marketMakingPairs: MarketMakingPair[] = [];

    const dispatch = createEventDispatcher();

    let isUpdating = "";
    let isDeleting = "";

    // Pagination
    let currentPage = 1;
    const itemsPerPage = 5;
    $: totalPages = Math.ceil(marketMakingPairs.length / itemsPerPage);
    $: paginatedPairs = marketMakingPairs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    async function UpdateMarketMakingPair(id: string, enable: boolean) {
        if (!id) return;
        isUpdating = id;
        const token = localStorage.getItem("admin-access-token");
        if (!token) return;
        await updateMarketMakingPair(
            id,
            { enable } as Partial<MarketMakingPairDto>,
            token,
        );
        dispatch("refresh");
        isUpdating = "";
    }

    async function DeleteMarketMakingPair(id: string) {
        if (!id) return;
        isDeleting = id;
        const token = localStorage.getItem("admin-access-token");
        if (!token) return;
        await removeMarketMakingPair(id, token);
        dispatch("refresh");
        isDeleting = "";
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        toast.success($_("copied"));
    }
</script>

{#if !marketMakingPairs}
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
    <div
        class="card bg-base-100 shadow-sm border border-base-200 overflow-hidden"
    >
        <div class="overflow-x-auto">
            <table class="table table-lg">
                <thead class="bg-base-200/50 text-base-content/70">
                    <tr>
                        <th class="uppercase text-xs font-semibold"
                            >{$_("icon")}</th
                        >
                        <th class="uppercase text-xs font-semibold"
                            >{$_("exchange")}</th
                        >
                        <th class="uppercase text-xs font-semibold"
                            >{$_("symbol")}</th
                        >
                        <th class="uppercase text-xs font-semibold"
                            >{$_("base")}</th
                        >
                        <th class="uppercase text-xs font-semibold"
                            >{$_("quote")}</th
                        >
                        <th class="uppercase text-xs font-semibold"
                            >{$_("asset_ids")}
                            <span class="normal-case"
                                >({$_("base")}/{$_("quote")})</span
                            >
                        </th>
                        <th class="uppercase text-xs font-semibold"
                            >{$_("fee_rate")}</th
                        >
                        <th class="text-center uppercase text-xs font-semibold"
                            >{$_("status")}</th
                        >
                        <th class="text-right uppercase text-xs font-semibold"
                            >{$_("action")}</th
                        >
                    </tr>
                </thead>
                <tbody>
                    {#if paginatedPairs.length === 0}
                        <tr>
                            <td
                                colspan="9"
                                class="text-center py-12 text-base-content/40"
                            >
                                {$_("no_pairs_found")}
                            </td>
                        </tr>
                    {/if}

                    {#each paginatedPairs as pair}
                        <tr class="hover:bg-base-200/30 transition-colors">
                            <td>
                                <div class="flex -space-x-3">
                                    <img
                                        class="inline-block min-w-8 min-h-8 h-8 w-8 rounded-full ring-2 ring-base-100"
                                        src={pair.base_icon_url}
                                        alt=""
                                    />
                                    <img
                                        class="inline-block min-w-8 min-h-8 h-8 w-8 rounded-full ring-2 ring-base-100"
                                        src={pair.quote_icon_url}
                                        alt=""
                                    />
                                </div>
                            </td>
                            <td class="font-medium"
                                ><span class="badge badge-ghost font-mono"
                                    >{pair.exchange_id}</span
                                ></td
                            >
                            <td class="font-medium"
                                ><span class="badge badge-ghost font-mono"
                                    >{pair.symbol}</span
                                ></td
                            >
                            <td>{pair.base_symbol}</td>
                            <td>{pair.quote_symbol}</td>
                            <!-- Combined Asset IDs column -->
                            <td class="max-w-[180px]">
                                <div class="flex flex-col gap-1">
                                    <!-- Base Asset ID -->
                                    <div
                                        class="flex items-center gap-1 group/id"
                                    >
                                        <span
                                            class="truncate text-xs opacity-50 font-mono"
                                            title={pair.base_asset_id}
                                        >
                                            {pair.base_asset_id.slice(
                                                0,
                                                8,
                                            )}...{pair.base_asset_id.slice(-4)}
                                        </span>
                                        <button
                                            class="btn btn-ghost btn-xs btn-square opacity-0 group-hover/id:opacity-100 transition-opacity"
                                            on:click={() =>
                                                copyToClipboard(
                                                    pair.base_asset_id,
                                                )}
                                        >
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
                                                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <!-- Quote Asset ID -->
                                    <div
                                        class="flex items-center gap-1 group/id"
                                    >
                                        <span
                                            class="truncate text-xs opacity-50 font-mono"
                                            title={pair.quote_asset_id}
                                        >
                                            {pair.quote_asset_id.slice(
                                                0,
                                                8,
                                            )}...{pair.quote_asset_id.slice(-4)}
                                        </span>
                                        <button
                                            class="btn btn-ghost btn-xs btn-square opacity-0 group-hover/id:opacity-100 transition-opacity"
                                            on:click={() =>
                                                copyToClipboard(
                                                    pair.quote_asset_id,
                                                )}
                                        >
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
                                                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {#if pair.custom_fee_rate}
                                    <span
                                        class="badge badge-primary badge-outline badge-sm"
                                        >{pair.custom_fee_rate}</span
                                    >
                                {:else}
                                    <span class="text-base-content/30">-</span>
                                {/if}
                            </td>
                            <td class="text-center">
                                <button
                                    class={clsx(
                                        "btn btn-xs btn-circle transition-all",
                                        pair.enable
                                            ? "btn-success text-white"
                                            : "btn-ghost text-base-content/40",
                                    )}
                                    on:click={async () => {
                                        const newEnable = !pair.enable;
                                        await UpdateMarketMakingPair(
                                            pair.id,
                                            newEnable,
                                        );
                                    }}
                                    disabled={!!isUpdating}
                                >
                                    {#if isUpdating === pair.id}
                                        <span
                                            class="loading loading-spinner loading-xs"
                                        ></span>
                                    {:else if pair.enable}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            class="w-5 h-5"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    {:else}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            class="w-5 h-5"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    {/if}
                                </button>
                            </td>
                            <td class="text-right">
                                <button
                                    class="btn btn-ghost btn-sm text-error hover:bg-error/10"
                                    on:click={async () => {
                                        if (
                                            confirm($_("confirm_delete_pair"))
                                        ) {
                                            await DeleteMarketMakingPair(
                                                pair.id,
                                            );
                                        }
                                    }}
                                >
                                    {#if isDeleting === pair.id}
                                        <span
                                            class="loading loading-spinner loading-xs"
                                        ></span>
                                    {:else}
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
                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                            />
                                        </svg>
                                    {/if}
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <!-- Pagination Footer -->
        <div
            class="flex items-center justify-between px-6 py-4 border-t border-base-200 bg-base-100"
        >
            <div class="text-sm text-base-content/60">
                {$_("showing")}
                <span class="font-medium">{paginatedPairs.length}</span>
                {$_("pairs")} of
                <span class="font-medium">{totalPages || 1}</span>
                {(totalPages || 1) === 1 ? "page" : "pages"}
            </div>
            <div class="join">
                <button
                    class="join-item btn btn-sm"
                    disabled={currentPage === 1}
                    on:click={() =>
                        (currentPage = Math.max(1, currentPage - 1))}
                >
                    {$_("previous")}
                </button>
                <button
                    class="join-item btn btn-sm"
                    disabled={currentPage === totalPages ||
                        marketMakingPairs.length === 0}
                    on:click={() =>
                        (currentPage = Math.min(totalPages, currentPage + 1))}
                >
                    {$_("next")}
                </button>
            </div>
        </div>
    </div>
{/if}
