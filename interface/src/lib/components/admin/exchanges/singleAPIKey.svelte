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

  // Mock permissions - TODO: Update backend to include permissions in API response
  const permissions = ["Read", "Trade"];
</script>

<tr class="hover:bg-base-200/30 transition-colors">
  <!-- EXCHANGE Column -->
  <td>
    <div class="flex items-center gap-3">
      <div class="avatar">
        <div class="mask mask-squircle w-10 h-10 bg-base-200 p-1.5">
          <img
            src={findExchangeIconByIdentifier(key.exchange)}
            alt={key.exchange}
            class="object-contain w-full h-full"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <span class="font-bold">{key.name}</span>
        <span class="text-xs text-base-content/60 font-mono lowercase"
          >{key.exchange}</span
        >
      </div>
    </div>
  </td>

  <!-- LABEL / KEY ID Column -->
  <td>
    <div class="flex flex-col gap-1">
      <span class="font-medium text-sm">{key.name}</span>
      <code class="text-xs text-base-content/60 font-mono">
        ...{key.api_key.slice(-6)}
      </code>
    </div>
  </td>

  <!-- PERMISSIONS Column -->
  <td>
    <div class="flex gap-1.5 flex-wrap">
      {#each permissions as permission}
        <span class="badge badge-sm badge-primary badge-outline"
          >{permission}</span
        >
      {/each}
    </div>
  </td>

  <!-- CREATED Column -->
  <td>
    <span class="text-sm text-base-content/70"
      >{key.last_update || "Oct 24, 2023"}</span
    >
  </td>

  <!-- STATUS Column -->
  <td class="text-center">
    {#if key.state === "alive"}
      <div class="tooltip" data-tip={$_("active")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5 text-success inline-block"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    {:else}
      <div class="tooltip" data-tip={$_("error")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-5 h-5 text-error inline-block"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    {/if}
  </td>

  <!-- ACTIONS Column -->
  <td class="text-right">
    {#if !deleteConfirm}
      <div class="flex items-center justify-end gap-2">
        <button class="btn btn-ghost btn-sm btn-square" title={$_("edit")}>
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
        <button
          class="btn btn-ghost btn-sm btn-square text-error/70 hover:text-error hover:bg-error/10"
          on:click={() => {
            deleteConfirm = true;
          }}
          title={$_("delete")}
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
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </div>
    {:else}
      <div class="flex items-center justify-end gap-2">
        <button class="btn btn-xs" on:click={() => (deleteConfirm = false)}>
          {$_("cancel")}
        </button>
        <button
          class="btn btn-xs btn-error"
          on:click={() => deleteAPIKey(key.key_id)}
        >
          {$_("confirm")}
        </button>
      </div>
    {/if}
  </td>
</tr>
