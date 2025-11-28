<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";

  export let mode: "both_token" | "single_token" = "both_token";
  export let tokenType: "base" | "quote" = "base";
  export let baseSymbol: string | null = null;
  export let quoteSymbol: string | null = null;
  export let baseIcon: string;
  export let quoteIcon: string;
</script>

<div class="flex flex-col justify-center items-center w-full">
  <div class="flex justify-center grow join w-full p-4 pb-0 px-8 text-sm">
    <button
      class={clsx(
        "btn btn-md w-[50%] max-w-52 join-item",
        mode === "both_token" && "btn-active",
        mode === "single_token" ? "rounded-tl-xl" : "rounded-l-xl",
      )}
      on:click={() => (mode = "both_token")}
    >
      <span class="opacity-80">
        {$_("both_token")}
      </span>
    </button>
    <button
      class={clsx(
        "btn btn-md w-[50%] max-w-52 join-item",
        mode === "single_token" && "btn-active",
        mode === "single_token" ? "rounded-tr-xl" : "rounded-r-xl",
      )}
      on:click={() => (mode = "single_token")}
    >
      <span class="opacity-80">
        {$_("single_token")}
      </span>
    </button>
  </div>

  {#if mode === "single_token"}
    <div
      class="flex justify-center grow join w-full py-0 px-8 text-sm opacity-60 mb-4"
    >
      <button
        class={clsx(
          "btn btn-xs w-[50%] max-w-52 join-item rounded-bl-xl rounded-tl-none",
          tokenType === "base" && "bg-base-content/10",
        )}
        on:click={() => (tokenType = "base")}
      >
        <img src={baseIcon} alt={baseSymbol} class="w-4 h-4" />
        <span class="opacity-80"> {baseSymbol} </span>
      </button>
      <button
        class={clsx(
          "btn btn-xs w-[50%] max-w-52 join-item rounded-br-xl rounded-tr-none",
          tokenType === "quote" && "bg-base-content/10",
        )}
        on:click={() => (tokenType = "quote")}
      >
        <img src={quoteIcon} alt={quoteSymbol} class="w-4 h-4" />
        <span class="opacity-80"> {quoteSymbol} </span>
      </button>
    </div>
  {/if}
</div>
