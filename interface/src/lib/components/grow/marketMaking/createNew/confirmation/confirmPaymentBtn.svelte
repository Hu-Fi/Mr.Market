<script lang="ts">
  import { _ } from "svelte-i18n";

  export let disabled = false;
  export let loading = false;
  export let onConfirm: () => void = () => {};

  const handleClick = () => {
    if (disabled || loading) return;
    onConfirm();
  };
</script>

<button
  class="btn bg-base-content text-base-100 w-full rounded-full no-animation max-w-md"
  class:btn-disabled={disabled || loading}
  class:opacity-50={disabled || loading}
  class:cursor-not-allowed={disabled || loading}
  disabled={disabled || loading}
  aria-disabled={disabled || loading}
  on:click={handleClick}
>
  {#if loading}
    <span class="loading loading-spinner loading-sm text-base-100"></span>
    <span class="ml-2">{$_("processing")}</span>
  {:else}
    {$_("pay")}
  {/if}
</button>
