<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { cleave } from "svelte-cleavejs";
  import { darkTheme } from "$lib/stores/theme";
  import { formatUSMoney } from "$lib/helpers/utils";
  import { maskOption } from "$lib/helpers/constants";
  import { Output, OutputAssetDialog } from "$lib/stores/swap";
</script>

<div class={clsx("flex flex-col space-y-1 p-4 py-2 mx-4 rounded-xl", $darkTheme ?  "bg-gray-800" : "bg-gray-50")}>
  <!-- Text and balance/account selector -->
  <div class="flex items-center justify-between my-1">
    <span class="text-xs"> {$_("to")} </span>
    <button class={clsx("flex items-center space-x-1")} on:click={()=>{OutputAssetDialog.set(true)}}>
      <span class="text-xs !text-[10px] opacity-60">
        {`${$_("trading")}: ${10} ${"BTC"}`}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-3 h-3 opacity-60"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  </div>

  <!-- Asset selector and amount input -->
  <div class="flex items-center">
    <button
      class={clsx("btn !h-[2.5rem] !min-h-[2.5rem] flex items-center rounded-full border-none shadow-none no-animation px-0", $darkTheme ? "bg-gray-800 hover:bg-gray-800" : "bg-gray-50 hover:bg-gray-50")}
      on:click={() => OutputAssetDialog.set(!$OutputAssetDialog)}
    >
      <img
        alt=""
        src={"https://mixin-images.zeromesh.net/HvYGJsV5TGeZ-X9Ek3FEQohQZ3fE9LBEBGcOcn4c4BNHovP4fW4YB97Dg5LcXoQ1hUjMEgjbl1DPlKg1TW7kK6XP=s128"}
        class="w-6 h-6"
      />
      <span class="font-semibold"> {"BTC"} </span>
      <div class="w-4">
        {#if !$OutputAssetDialog}
          <!-- Caret down Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="w-4 h-4 opacity-40"
            ><path
              xmlns="http://www.w3.org/2000/svg"
              d="M17 10L12 16L7 10H17Z"
              fill="currentColor"
            ></path></svg
          >
        {:else}
          <!-- Caret up Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="w-4 h-4 opacity-40"
            ><path
              xmlns="http://www.w3.org/2000/svg"
              d="M7 14L12 8L17 14L7 14Z"
              fill="currentColor"
            ></path></svg
          >
        {/if}
      </div>
    </button>
    
    <input
      type="tel"
      use:cleave={maskOption}
      bind:value={$Output}
      class={clsx(
        "px-2 pr-0", "w-full",
        "input focus:outline-none text-2xl font-bold text-right",
        $darkTheme ? "bg-gray-800 focus:border-gray-800" : "bg-gray-50 focus:border-gray-50"
      )}
    />
  </div>

  <!-- USD value -->
  <div class="flex items-center justify-end mb-2">
    
    {#if $Output}
      <span class={clsx("text-[10px] mx-2 my-0.5 capitalize opacity-60")}>
        {formatUSMoney(123*$Output)}
      </span>
    {/if}
  </div>
</div>