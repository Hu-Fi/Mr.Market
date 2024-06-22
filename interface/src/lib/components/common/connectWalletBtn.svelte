<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { mixinAuthWrapper } from "$lib/helpers/mixin";
  import { mixinConnectLoading } from "$lib/stores/home";

  export let clazz: string;
</script>

<button
  class={clsx("btn rounded-full no-animation text-base-100 !h-10 min-h-10 bg-slate-800 hover:bg-slate-800 focus:bg-slate-800", clazz)}
  on:click={async () => {
    await mixinAuthWrapper(false);
  }}
  disabled={$mixinConnectLoading}
>
  {#if $mixinConnectLoading}
    <span class="loading loading-xs mx-3 text-base-100" />
  {:else}
    <span
      class={clsx(
        "font-semibold",
      )}
    >
      {$_("connect_wallet")}
    </span>
  {/if}
</button>
