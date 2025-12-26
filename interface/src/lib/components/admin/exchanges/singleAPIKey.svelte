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

  let showFullKey = false;
</script>

<div
  class="flex items-center justify-between p-4 border-t border-base-300 hover:bg-base-200/40 transition-colors group"
>
  <div class="flex items-center gap-4">
    <!-- Icon -->
    <div class="avatar placeholder">
      <div
        class="mask mask-squircle w-10 h-10 bg-base-200 text-neutral-content p-1.5"
      >
        <img
          src={findExchangeIconByIdentifier(key.exchange)}
          alt={key.exchange}
          class="object-contain w-full h-full"
        />
      </div>
    </div>

    <!-- Info -->
    <div class="flex flex-col gap-0.5">
      <div class="flex items-center gap-2">
        <span class="font-bold text-lg leading-tight">{key.name}</span>
        <span
          class="badge badge-sm badge-ghost capitalize font-mono text-[10px] tracking-wider opacity-70"
          >{key.exchange}</span
        >
      </div>

      <!-- API Key Row -->
      <div class="flex items-center gap-2 text-sm text-base-content/70">
        <span
          class="font-mono bg-base-200/50 px-1.5 py-0.5 rounded text-xs select-all"
        >
          {showFullKey ? key.api_key : key.api_key.slice(0, 6) + "..."}
        </span>
        <button
          class="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition-opacity"
          on:click={() => (showFullKey = !showFullKey)}
          title={showFullKey ? "Hide API Key" : "Show API Key"}
        >
          {#if showFullKey}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-3.5 h-3.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-3.5 h-3.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </div>

  <div class="flex items-center gap-6">
    <!-- Status & Time -->
    <div class="flex flex-col items-end gap-1">
      {#if key.state === "alive"}
        <div
          class="badge badge-success badge-sm badge-outline capitalize gap-1.5 pl-1.5 pr-2"
        >
          <div class="w-1.5 h-1.5 rounded-full bg-success"></div>
          {key.state}
        </div>
      {:else if key.state}
        <div
          class="badge badge-error badge-sm badge-outline capitalize gap-1.5 pl-1.5 pr-2"
        >
          <div class="w-1.5 h-1.5 rounded-full bg-error"></div>
          {key.state}
        </div>
      {/if}
      {#if key.last_update}
        <span class="text-[10px] text-base-content/40 font-mono">
          {key.last_update}
        </span>
      {/if}
    </div>

    <!-- Actions -->
    <div class="flex items-center">
      {#if !deleteConfirm}
        <button
          class="btn btn-ghost btn-sm btn-square text-error/70 hover:text-error hover:bg-error/10"
          on:click={() => {
            deleteConfirm = true;
          }}
          title={$_("delete")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-5 h-5"
          >
            <path
              fill-rule="evenodd"
              d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 001.5.06l.3-7.5z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      {:else}
        <div
          class="flex items-center gap-1 bg-base-200/50 rounded-lg p-1 animate-in fade-in zoom-in duration-200"
        >
          <button
            class="btn btn-xs btn-ghost btn-circle"
            on:click={() => (deleteConfirm = false)}
            title="Cancel"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path
                d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
              />
            </svg>
          </button>
          <button
            class="btn btn-xs btn-error btn-circle text-white shadow-sm"
            on:click={() => deleteAPIKey(key.key_id)}
            title="Confirm Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-4 h-4"
            >
              <path
                fill-rule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
