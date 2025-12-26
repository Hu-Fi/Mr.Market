<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { invalidate } from "$app/navigation";
  import {
    addExchange,
    getCcxtExchangeDetails,
  } from "$lib/helpers/mrm/admin/growdata";

  export let allCcxtExchanges: string[] = [];

  let AddNewName = "";
  let AddNewExchangeId = "";
  let AddNewIconUrl = "";

  let addDialog = false;
  let isAdding = false;
  let isDropdownOpen = false;

  async function AddExchange(
    name: string,
    exchangeId: string,
    iconUrl: string,
  ) {
    if (!name || !exchangeId) return;
    isAdding = true;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    await addExchange(
      { name, exchange_id: exchangeId, icon_url: iconUrl },
      token,
    );
    setTimeout(() => {
      invalidate("admin:settings:exchanges").finally(() => {
        isAdding = false;
        addDialog = false;
        AddNewName = "";
        AddNewExchangeId = "";
        AddNewIconUrl = "";
      });
    }, getRandomDelay());
  }

  function getRandomDelay() {
    return Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
  }

  function handleClickOutside(event: MouseEvent) {
    if (isDropdownOpen) {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown")) {
        isDropdownOpen = false;
      }
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<details class="dropdown dropdown-end" bind:open={addDialog}>
  <summary
    class="btn btn-primary gap-2 shadow-lg hover:shadow-primary/20 transition-all"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      class="w-4 h-4"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
    {$_("add_exchange")}
  </summary>
  <div
    class="menu dropdown-content bg-base-100 rounded-box p-6 shadow-xl border border-base-200 w-96 mt-2"
  >
    <h3 class="font-bold text-lg mb-4">{$_("add_new_exchange")}</h3>
    <div class="flex flex-col gap-4">
      <div class="form-control w-full">
        <span class="label">
          <span class="label-text font-medium">{$_("exchange_id")}</span>
          <span class="label-text-alt text-base-content/60">(ccxt id)</span>
        </span>
        <div class="dropdown w-full" class:dropdown-open={isDropdownOpen}>
          <input
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            placeholder={$_("placeholder_exchange_id")}
            bind:value={AddNewExchangeId}
            on:focus={() => (isDropdownOpen = true)}
            on:input={() => (isDropdownOpen = true)}
          />
          {#if isDropdownOpen && allCcxtExchanges.filter((e) => e
                .toLowerCase()
                .includes(AddNewExchangeId.toLowerCase())).length > 0}
            <ul
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto block z-[50] mt-1 border border-base-200"
            >
              {#each allCcxtExchanges.filter((e) => e
                  .toLowerCase()
                  .includes(AddNewExchangeId.toLowerCase())) as exchangeId}
                <li>
                  <button
                    type="button"
                    class="w-full text-left"
                    on:click={async () => {
                      AddNewExchangeId = exchangeId;
                      isDropdownOpen = false;

                      // Auto-fill name (Always override)
                      AddNewName =
                        AddNewExchangeId.charAt(0).toUpperCase() +
                        AddNewExchangeId.slice(1);

                      // Auto-fill icon (Always override)
                      try {
                        const token =
                          localStorage.getItem("admin-access-token");
                        if (token) {
                          const details = await getCcxtExchangeDetails(
                            AddNewExchangeId,
                            token,
                          );
                          if (details.urls && details.urls.logo) {
                            AddNewIconUrl = details.urls.logo;
                          }
                        }
                      } catch (e) {
                        console.error("Failed to load exchange details", e);
                      }
                    }}
                  >
                    {exchangeId}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>
      <div class="form-control w-full">
        <span class="label">
          <span class="label-text font-medium">{$_("display_name")}</span>
        </span>
        <input
          type="text"
          class="input input-bordered w-full focus:input-primary transition-all"
          placeholder={$_("placeholder_exchange_name")}
          bind:value={AddNewName}
        />
      </div>
      <div class="form-control w-full">
        <span class="label">
          <span class="label-text font-medium">{$_("icon_url")}</span>
        </span>
        <input
          type="text"
          class="input input-bordered w-full focus:input-primary transition-all"
          placeholder={$_("placeholder_url")}
          bind:value={AddNewIconUrl}
        />
        {#if AddNewIconUrl}
          <div class="mt-2">
            <div class="rounded-xl">
              <img
                src={AddNewIconUrl}
                alt="Preview"
                on:error={(e) => {
                  const target = e.currentTarget;
                  if (target instanceof HTMLImageElement) {
                    target.style.display = "none";
                  }
                }}
                on:load={(e) => {
                  const target = e.currentTarget;
                  if (target instanceof HTMLImageElement) {
                    target.style.display = "block";
                  }
                }}
              />
            </div>
          </div>
        {/if}
      </div>
      <button
        class="btn btn-primary w-full mt-2"
        on:click={async () => {
          await AddExchange(AddNewName, AddNewExchangeId, AddNewIconUrl);
        }}
      >
        <span class={clsx(isAdding && "loading loading-spinner loading-sm")}>
          {$_("add_exchange")}
        </span>
      </button>
    </div>
  </div>
</details>
