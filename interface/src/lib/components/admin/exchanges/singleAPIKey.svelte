<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { AdminSingleKey } from "$lib/types/hufi/admin";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import { createEventDispatcher } from "svelte";

  export let key: AdminSingleKey;
  let deleteConfirm = false;
  const dispatch = createEventDispatcher();

  const deleteAPIKey = (key_id: string) => {
    dispatch("delete", key_id);
    deleteConfirm = false;
  };
</script>

<div
  class="flex items-center justify-between p-4 border-b border-x first:border-t last:border-b"
>
  <div class="flex items-center space-x-4">
    <div class="avatar">
      <div class="mask mask-squircle w-8 h-8">
        <img src={findExchangeIconByIdentifier(key.exchange)} alt="" class="" />
      </div>
    </div>
    <div class="flex flex-col">
      <span class="text-base capitalize font-semibold"> {key.exchange} </span>
      <span class="text-xs opacity-60 select-text"> {key.api_key} </span>
    </div>
  </div>

  <div class="flex space-x-8">
    <!-- Actions -->
    <div class="flex items-center justify-center">
      {#if !deleteConfirm}
        <button
          class="btn btn-sm"
          on:click={() => {
            deleteConfirm = true;
          }}
        >
          <span>{$_("delete")}</span>
        </button>
      {:else}
        <div class="flex space-x-4 items-center">
          <button
            class="flex items-center justify-center rounded-full p-0 h-5 w-5"
            on:click={() => (deleteConfirm = false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>

          <button
            class="flex items-center justify-center rounded-full p-0 h-5 w-5"
            on:click={() => deleteAPIKey(key.key_id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </button>
        </div>
      {/if}
    </div>
    <div class="flex flex-col items-end justify-center space-y-1">
      {#if key.state === "alive"}
        <div class="badge badge-primary badge-outline capitalize">
          {key.state}
        </div>
      {:else if key.state}
        <div class="badge badge-error badge-outline capitalize">
          {key.state}
        </div>
      {/if}
      <div>
        <span class="text-xs opacity-60"> {key.last_update || ""} </span>
      </div>
    </div>
  </div>
</div>
