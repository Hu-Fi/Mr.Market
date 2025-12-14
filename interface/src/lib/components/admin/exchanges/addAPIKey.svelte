<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { invalidate } from "$app/navigation";
  import {
    addAPIKey,
    getEncryptionPublicKey,
  } from "$lib/helpers/hufi/admin/exchanges";
  import { getAllCcxtExchanges } from "$lib/helpers/hufi/admin/growdata";
  import { encryptSecret } from "$lib/helpers/crypto";
  import { onMount } from "svelte";

  let allCcxtExchanges: string[] = [];

  let AddNewExchange = "";
  let AddNewName = "";
  let AddNewApiKey = "";
  let AddNewApiSecret = "";
  let publicKey = "";
  let encryptionError = "";

  let addDialog = false;
  let isAdding = false;
  let isDropdownOpen = false;

  async function AddAPIKey(
    exchange: string,
    name: string,
    api_key: string,
    api_secret: string,
  ) {
    if (!exchange || !name || !api_key || !api_secret) return;
    isAdding = true;
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;

    if (!publicKey) {
      encryptionError = $_("encryption_key_error");
      isAdding = false;
      return;
    }

    try {
      const encryptedSecret = await encryptSecret(api_secret, publicKey);
      if (!encryptedSecret) {
        encryptionError = $_("encryption_failed");
        isAdding = false;
        return;
      }

      await addAPIKey(
        { exchange, name, api_key, api_secret: encryptedSecret },
        token,
      );
    } catch (e) {
      console.error(e);
      encryptionError = $_("add_key_failed");
      isAdding = false;
      return;
    }
    setTimeout(() => {
      invalidate("admin:settings:api-keys").finally(() => {
        isAdding = false;
        addDialog = false;
        AddNewExchange = "";
        AddNewName = "";
        AddNewApiKey = "";
        AddNewApiSecret = "";
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

  onMount(async () => {
    const token = localStorage.getItem("admin-access-token");
    if (!token) return;
    try {
      allCcxtExchanges = await getAllCcxtExchanges(token);
      const res = await getEncryptionPublicKey(token);
      publicKey = res.publicKey;
    } catch (e) {
      console.error(e);
    }
  });
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
    {$_("add_api_key")}
  </summary>
  <div
    class="menu dropdown-content bg-base-100 rounded-box p-6 shadow-xl border border-base-200 w-96 mt-2"
  >
    <h3 class="font-bold text-lg mb-4">{$_("add_new_api_key")}</h3>
    <div class="flex flex-col gap-4">
      <div class="form-control w-full">
        <span class="label">
          <span class="label-text font-medium">{$_("exchange")}</span>
        </span>
        <div class="dropdown w-full" class:dropdown-open={isDropdownOpen}>
          <input
            type="text"
            class="input input-bordered w-full focus:input-primary transition-all"
            placeholder={$_("placeholder_exchange_id")}
            bind:value={AddNewExchange}
            on:focus={() => (isDropdownOpen = true)}
            on:input={() => (isDropdownOpen = true)}
          />
          {#if isDropdownOpen && allCcxtExchanges.filter((e) => e
                .toLowerCase()
                .includes(AddNewExchange.toLowerCase())).length > 0}
            <ul
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto block z-[50] mt-1 border border-base-200"
            >
              {#each allCcxtExchanges.filter((e) => e
                  .toLowerCase()
                  .includes(AddNewExchange.toLowerCase())) as exchangeId}
                <li>
                  <button
                    type="button"
                    class="w-full text-left"
                    on:click={() => {
                      AddNewExchange = exchangeId;
                      isDropdownOpen = false;
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
          placeholder={$_("placeholder_key_name")}
          bind:value={AddNewName}
        />
      </div>
      <div class="form-control w-full">
        <span class="label">
          <span class="label-text font-medium">{$_("api_key")}</span>
        </span>
        <input
          type="text"
          class="input input-bordered w-full focus:input-primary transition-all"
          placeholder={$_("placeholder_api_key")}
          bind:value={AddNewApiKey}
        />
      </div>
      <div class="form-control w-full">
        <span class="label">
          <span class="label-text font-medium">{$_("api_secret")}</span>
        </span>
        <input
          type="password"
          class="input input-bordered w-full focus:input-primary transition-all"
          placeholder={$_("placeholder_api_secret")}
          bind:value={AddNewApiSecret}
        />
      </div>
      <button
        class="btn btn-primary w-full mt-2"
        on:click={async () => {
          await AddAPIKey(
            AddNewExchange,
            AddNewName,
            AddNewApiKey,
            AddNewApiSecret,
          );
        }}
        disabled={isAdding}
      >
        <span class={clsx(isAdding && "loading loading-spinner loading-sm")}>
          {$_("add_api_key")}
        </span>
      </button>
    </div>
  </div>
</details>
