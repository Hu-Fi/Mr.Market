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

<div class="flex flex-col justify-center items-center w-full mt-4">
  <div class="flex p-1 bg-base-200/50 rounded-2xl w-[90%] max-w-md">
    <button
      class={clsx(
        "btn btn-sm border-0 flex-1 h-10 min-h-0 rounded-xl capitalize font-medium text-sm no-animation",
        mode === "both_token"
          ? "bg-base-100 shadow-sm text-base-content"
          : "bg-transparent text-base-content/50 hover:bg-base-200/50",
      )}
      on:click={() => (mode = "both_token")}
    >
      {$_("both_token")}
    </button>
    <div class="dropdown dropdown-bottom dropdown-end flex-1 group">
      <button
        tabindex="0"
        type="button"
        class={clsx(
          "btn btn-sm border-0 w-full h-10 min-h-0 rounded-xl capitalize font-medium text-sm flex justify-center items-center gap-2 no-animation",
          mode === "single_token"
            ? "bg-base-100 shadow-sm text-base-content"
            : "bg-transparent text-base-content/50 hover:bg-base-200/50",
        )}
        on:click={() => (mode = "single_token")}
      >
        {$_("single_token")}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-chevron-down w-3 h-3 transition-transform duration-200 group-focus-within:rotate-180"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <ul
        tabindex="0"
        class="dropdown-content z-[2] menu p-2 shadow-lg bg-base-100 rounded-xl w-full mt-2 border border-base-200"
      >
        <li>
          <button
            class={clsx(tokenType === "base" && "active")}
            on:click={() => {
              tokenType = "base";
              mode = "single_token";
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
            }}
          >
            <img src={baseIcon} alt={baseSymbol} class="w-4 h-4" />
            {baseSymbol}
          </button>
        </li>
        <li>
          <button
            class={clsx(tokenType === "quote" && "active")}
            on:click={() => {
              tokenType = "quote";
              mode = "single_token";
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
            }}
          >
            <img src={quoteIcon} alt={quoteSymbol} class="w-4 h-4" />
            {quoteSymbol}
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>
