<script lang="ts">
  import clsx from "clsx";
  import { validate } from "uuid";
  import { _ } from "svelte-i18n";
  import toast from "svelte-french-toast";
  import { page } from "$app/stores";
  import { invalidate } from "$app/navigation";
  import { mixinAsset } from "$lib/helpers/mixin/mixin";
  import { getRandomDelay } from "$lib/helpers/utils";
  import type {
    SimplyGrowToken,
    SimplyGrowTokenDto,
  } from "$lib/types/hufi/grow";
  import {
    addSimplyGrowToken,
    updateSimplyGrowToken,
    removeSimplyGrowToken,
  } from "$lib/helpers/mrm/admin/growdata";

  $: simplyGrowTokens = $page.data.growInfo.simply_grow
    .tokens as SimplyGrowToken[];

  let AddNewAssetId = "";
  let AddNewName = "";
  let AddNewSymbol = "";
  let AddNewIconUrl = "";
  let AddNewApy = "";

  let addDialog = false;
  let isAdding = false;
  let isUpdating = "";
  let isDeleting = "";
  let isRefreshing = false;
  let isIconFetching = false;

  const cleanUpStates = () => {
    isAdding = false;
    addDialog = false;
    AddNewAssetId = "";
    AddNewName = "";
    AddNewSymbol = "";
    AddNewIconUrl = "";
    AddNewApy = "";
  };

  async function AddSimplyGrowToken(growToken: SimplyGrowTokenDto) {
    if (!growToken.asset_id || !growToken.name || !growToken.symbol) return;
    isAdding = true;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    addSimplyGrowToken(growToken, token)
      .then(() => {
        setTimeout(() => {
          invalidate("admin:settings").finally(() => {
            cleanUpStates();
          });
        }, getRandomDelay());
      })
      .catch((error) => {
        cleanUpStates();
        console.error(error);
      });
  }

  async function UpdateSimplyGrowToken(id: string, enable: boolean) {
    if (!id) return;
    isUpdating = id;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    await updateSimplyGrowToken(id, { enable }, token).catch((error) => {
      console.error(error);
    });

    setTimeout(() => {
      invalidate("admin:settings").finally(() => {
        isUpdating = "";
      });
    }, getRandomDelay());
  }

  async function DeleteSimplyGrowToken(id: string) {
    if (!id) return;
    isDeleting = id;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    await removeSimplyGrowToken(id, token);
    setTimeout(() => {
      invalidate("admin:settings").finally(() => {
        isDeleting = "";
      });
    }, getRandomDelay());
  }

  async function RefreshSimplyGrowTokens() {
    isRefreshing = true;
    await invalidate("admin:settings").finally(() => {
      setTimeout(() => {
        isRefreshing = false;
      }, getRandomDelay());
    });
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success($_("copied"));
  }
</script>

{#if !simplyGrowTokens}
  <div class="w-full h-full flex justify-center items-center">
    <button
      class="btn btn-primary"
      on:click={() => {
        window.location.reload();
      }}
    >
      {$_("reload")}
    </button>
  </div>
{:else}
  <div class="overflow-x-auto">
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>{"name"}</th>
          <th>{"icon_url"}</th>
          <th>{"symbol"}</th>
          <th>{"asset_id"}</th>
          <th>{"apy"}</th>
          <th>{$_("enabled")}</th>
          <th>{$_("actions")}</th>
        </tr>
      </thead>
      <tbody>
        {#if simplyGrowTokens.length === 0}
          <tr>
            <td colspan="8" class="text-center">{$_("no_result_found")}</td>
          </tr>
        {/if}

        {#each simplyGrowTokens as token}
          <tr>
            <td />
            <td>
              <span class="text-xs select-text"> {token.name} </span>
            </td>
            <td
              class="cursor-pointer"
              on:click={() => {
                window.open(token.icon_url, "_blank");
              }}
            >
              <div class="tooltip" data-tip="Click to open in new tab">
                <img src={token.icon_url} class="w-6 h-6" alt="" />
              </div>
            </td>
            <td>
              <span class="text-xs select-text"> {token.symbol} </span>
            </td>
            <td class="max-w-[120px]">
              <div class="flex items-center gap-1 group/id">
                <span
                  class="truncate text-xs opacity-50 font-mono"
                  title={token.asset_id}
                >
                  {token.asset_id}
                </span>
                <button
                  class="btn btn-ghost btn-xs btn-square opacity-0 group-hover/id:opacity-100 transition-opacity"
                  on:click={() => copyToClipboard(token.asset_id)}
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
            </td>
            <td>
              <span class="text-xs select-text"> {token.apy || "N/A"} </span>
            </td>
            <td>
              <div
                class="tooltip"
                data-tip={isUpdating === token.asset_id
                  ? $_("updating")
                  : token.enable
                    ? $_("click_to_disable")
                    : $_("click_to_enable")}
              >
                <button
                  on:click={async () => {
                    const newEnable = !token.enable;
                    await UpdateSimplyGrowToken(token.asset_id, newEnable);
                  }}
                >
                  <span
                    class={clsx(
                      isUpdating === token.asset_id &&
                        "loading loading-spinner loading-xs disabled",
                    )}
                  >
                    {token.enable ? "✅" : "❌"}
                  </span>
                </button>
              </div>
            </td>
            <td>
              <button
                class="btn btn-ghost rounded-2xl btn-xs px-2"
                on:click={async () => {
                  await DeleteSimplyGrowToken(token.asset_id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class={clsx(
                    "size-4",
                    isDeleting === token.asset_id && "loading loading-spinner",
                  )}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="flex items-center justify-end mt-4 space-x-2">
    <details class="dropdown dropdown-end" bind:open={addDialog}>
      <summary class="btn m-1">
        <span>
          {$_("add")}
        </span>
      </summary>
      <div
        class="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow"
      >
        <div class="p-2 flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <span class="label"> {"name"} </span>
            <input
              type="text"
              class="input input-bordered focus:outline-none"
              bind:value={AddNewName}
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"symbol"} </span>
            <input
              type="text"
              class="input input-bordered focus:outline-none"
              bind:value={AddNewSymbol}
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"asset_id"} </span>
            <input
              type="text"
              class="input input-bordered focus:outline-none"
              bind:value={AddNewAssetId}
            />
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"icon_url"} </span>
            {#if !AddNewIconUrl && validate(AddNewAssetId)}
              <button
                class="btn btn-bordered btn-md no-animation"
                on:click={async () => {
                  isIconFetching = true;
                  const asset = await mixinAsset(AddNewAssetId);
                  AddNewIconUrl = asset.icon_url;
                  isIconFetching = false;
                }}
              >
                <span
                  class={clsx(
                    isIconFetching && "loading loading-spinner loading-sm",
                  )}
                >
                  {$_("fetch")}
                </span>
              </button>
            {:else}
              <input
                type="text"
                class="input input-bordered focus:outline-none"
                bind:value={AddNewIconUrl}
              />
            {/if}
          </div>
          <div class="flex flex-col gap-2">
            <span class="label"> {"apy"} </span>
            <input
              type="text"
              class="input input-bordered focus:outline-none"
              bind:value={AddNewApy}
            />
          </div>

          <button
            class="btn bg-base-200 hover:bg-base-200 border-none no-animation mt-4"
            on:click={async () => {
              await AddSimplyGrowToken({
                asset_id: AddNewAssetId,
                name: AddNewName,
                symbol: AddNewSymbol,
                icon_url: AddNewIconUrl,
                apy: AddNewApy,
                enable: true,
              });
            }}
          >
            <span
              class={clsx(isAdding && "loading loading-spinner loading-sm")}
            >
              {$_("add")}
            </span>
          </button>
        </div>
      </div>
    </details>
    <button
      class="btn bg-base-200 hover:bg-base-200 border-none no-animation"
      on:click={async () => {
        await RefreshSimplyGrowTokens();
      }}
    >
      <span class={clsx(isRefreshing && "loading loading-spinner loading-sm")}>
        {$_("refresh")}
      </span>
    </button>
  </div>
{/if}
