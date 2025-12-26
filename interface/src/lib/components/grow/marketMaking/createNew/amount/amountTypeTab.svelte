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
  <div class="flex justify-center grow join w-full p-4 pb-0 text-sm w-80">
    <button
      class={clsx(
        "btn btn-md w-[45%] max-w-52 join-item rounded-l-xl bg-base-100",
        mode === "both_token" && "btn-active bg-base-200",
      )}
      on:click={() => (mode = "both_token")}
    >
      <span class="opacity-80 font-normal">
        {$_("both_token")}
      </span>
    </button>
    <div
      class="dropdown dropdown-bottom dropdown-end w-[45%] max-w-52 join-item group"
    >
      <button
        tabindex="0"
        type="button"
        class={clsx(
          "btn btn-md w-full justify-center rounded-r-xl bg-base-100",
          mode === "single_token" && "btn-active bg-base-200",
        )}
        on:click={() => (mode = "single_token")}
      >
        <span class="opacity-80 font-normal">
          {$_("single_token")}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-chevron-down opacity-70 transition-transform duration-200 group-focus-within:rotate-180 w-2 h-2"
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
        class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full mt-1"
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
