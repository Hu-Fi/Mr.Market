<script lang="ts">
  import { _ } from "svelte-i18n";

  export let disabled = false;
  export let onConfirm: () => void = () => {};

  const handleClick = () => {
    if (disabled) return;
    onConfirm();
  };
</script>

<button
  class="btn bg-base-content text-base-100 w-full max-w-md rounded-full no-animation"
  class:btn-disabled={disabled}
  class:opacity-50={disabled}
  class:cursor-not-allowed={disabled}
  disabled={disabled}
  aria-disabled={disabled}
  on:click={handleClick}
>
  {$_("confirm")}
</button>

