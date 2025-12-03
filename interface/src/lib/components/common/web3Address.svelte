<script lang="ts">
    import clsx from "clsx";
    import { _ } from "svelte-i18n";
    import { onDestroy } from "svelte";
    // import { user } from "$lib/stores/wallet";
    import mixinIcon from "$lib/images/mixin.png";
    // import { ETH_UUID } from "$lib/helpers/constants";
    import { mixinConnected } from "$lib/stores/home";
    import {
        createSimplyGrowRewardAddressDialog,
        createSimplyGrowRewardAddress,
    } from "$lib/stores/grow";

    onDestroy(() => {
        createSimplyGrowRewardAddressDialog.set(false);
        createSimplyGrowRewardAddress.set("");
    });

    let closeTooltip = true;
    let closeTooltipTimeout = 4000;
    let validatingAddress = false;
    let validAddress = false;
    let addressTooltip = false;
    // let mixinAddressesLoaded = false;
    // let mixinAddressesLoading = false;
</script>

<div class="flex flex-col space-y-2 mx-4">
    <div class="flex space-x-1 items-center mx-2 w-full">
        <span class="text-sm">
            {$_("reward_address")}
        </span>
        <button
            data-tip={$_("reward_address_intro")}
            on:click={() => {
                addressTooltip = !addressTooltip;
                if (closeTooltip) {
                    setTimeout(() => {
                        addressTooltip = false;
                    }, closeTooltipTimeout);
                }
            }}
            class={clsx(
                "tooltip tooltip-bottom z-20",
                addressTooltip ? "tooltip-open" : "",
            )}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                />
            </svg>
        </button>
    </div>

    <div
        class={clsx("flex flex-col w-full px-2", $mixinConnected ? "join" : "")}
    >
        {#if $mixinConnected}
            <input
                type="text"
                placeholder={$_("enter_reward_address")}
                bind:value={$createSimplyGrowRewardAddress}
                class="input input-ghost focus:outline-none focus:border-x-0 focus:border-base-300 z-10 absolute join-item pr-0"
                data-testid="reward-address-input"
            />
            <details
                class="dropdown dropdown-end cursor-pointer join-item"
                bind:open={$createSimplyGrowRewardAddressDialog}
                data-testid="select-reward-address"
            >
                <summary
                    class="flex justify-between text-end border rounded-lg items-center h-12"
                >
                    <div class="flex justify-end mx-4 w-full">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1"
                            stroke="currentColor"
                            class="size-4"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    </div>
                </summary>
                <ul
                    class="p-4 shadow menu dropdown-content z-[1] rounded-box bg-white text-sm w-full"
                >
                    <button
                        on:click={async () => {
                            const token =
                                localStorage.getItem("mixin-oauth") || "";
                            if (!token) {
                                return;
                            }
                        }}
                    >
                        <div class="flex flex-col space-y-2">
                            <div class="flex items-center space-x-3">
                                <div class="avatar">
                                    <div
                                        class="ring-primary ring-offset-base-100 w-6 rounded-full border border-base-300"
                                    >
                                        <img
                                            src={mixinIcon}
                                            alt="mixin"
                                            class="size-6"
                                        />
                                    </div>
                                </div>
                                <span>
                                    {$_("read_deposit_address_from_mixin")}
                                </span>
                            </div>
                        </div>
                    </button>
                </ul>
            </details>
        {:else}
            <input
                type="text"
                placeholder={$_("enter_reward_address")}
                bind:value={$createSimplyGrowRewardAddress}
                class="input input-bordered border-base-300 focus:outline-none w-full z-10"
                data-testid="reward-address-input"
            />
        {/if}
        {#if $createSimplyGrowRewardAddress.length > 0}
            <div class="flex items-center justify-start mx-2">
                {#if validatingAddress}
                    <span class="text-xs text-green-500">
                        {$_("validating_address")}
                    </span>
                {:else if validAddress}
                    <span class="text-xs text-green-500">
                        {$_("valid_address")}
                    </span>
                {:else if $createSimplyGrowRewardAddress.length > 2}
                    <span class="text-xs text-red-500">
                        {$_("invalid_address")}
                    </span>
                {/if}
            </div>
        {/if}
    </div>
</div>
