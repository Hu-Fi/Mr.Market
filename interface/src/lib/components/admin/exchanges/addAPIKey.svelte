<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { invalidate } from "$app/navigation";
  import {
    addAPIKey,
    getEncryptionPublicKey,
  } from "$lib/helpers/mrm/admin/exchanges";
  import { getAllCcxtExchanges } from "$lib/helpers/mrm/admin/growdata";
  import { encryptSecret } from "$lib/helpers/encryption/crypto";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";

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
    } catch (e: any) {
      console.error(e);
      encryptionError = e.message || $_("add_key_failed");
      isAdding = false;
      return;
    }
    toast.success($_("success"));
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
  $: if (!addDialog) {
    encryptionError = "";
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
    {$_("add_api_key")}
  </summary>
  <div
    class="dropdown-content bg-base-100 rounded-box p-6 shadow-xl border border-base-200 w-[32rem] mt-2 max-h-[80vh] overflow-y-auto"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold text-lg">{$_("add_new_api_key")}</h3>
      <button
        class="btn btn-sm btn-circle btn-ghost"
        on:click={() => (addDialog = false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
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
        <div class="label mt-2">
          <span class="label-text-alt text-base-content/60 text-xs">
            {$_("api_secret_note")}
          </span>
        </div>
      </div>

      {#if encryptionError}
        <div class="alert alert-error shadow-lg my-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="break-all">{encryptionError}</span>
        </div>
      {/if}
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
