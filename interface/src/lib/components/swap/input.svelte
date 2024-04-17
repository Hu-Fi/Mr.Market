<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { cleave } from "svelte-cleavejs";
  import { darkTheme } from "$lib/stores/theme";
  import { maskOption } from "$lib/helpers/constants";
  import { findChainIcon, formatUSMoney } from "$lib/helpers/utils";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import { Input, InputAssetDialog, InputAsset, InputBalanceDialog, InputBalanceAccount } from "$lib/stores/swap";
</script>

<div class={clsx("flex flex-col space-y-1 p-4 py-2 mx-4 rounded-xl", $darkTheme ?  "bg-gray-800" : "bg-stone-100")}>
  <!-- Text and balance/account selector -->
  <div class="flex items-center justify-between my-1">
    <span class="text-xs"> {$_("from")} </span>
    <button class={clsx("flex items-center space-x-1")} on:click={()=>{InputBalanceDialog.set(true)}} data-testid="from-account">
      <span class="text-xs !text-[10px] opacity-60">
        {`${$InputBalanceAccount.name}: ${$InputBalanceAccount.balance} ${$InputAsset.symbol}`}
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
      class={clsx("btn !h-[2.5rem] !min-h-[2.5rem] flex items-center rounded-full border-none shadow-none no-animation px-0", $darkTheme ? "bg-gray-800 hover:bg-gray-800" : "bg-stone-100 hover:bg-stone-100")}
      on:click={() => InputAssetDialog.set(!$InputAssetDialog)}
      data-testid="select-from-asset"
    >
      <AssetIcon
        assetIcon={$InputAsset.icon_url}
        chainIcon={findChainIcon($InputAsset.chain_id)}
        clazz="w-6 h-6"
        claxx="w-2 h-2"
      />
      <span class="font-semibold" data-testid="from-asset-symbol"> {$InputAsset.symbol} </span>
      <div class="w-4">
        {#if !$InputAssetDialog}
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
      type="text"
      inputmode="decimal"
      data-testid="input-amount"
      use:cleave={maskOption}
      bind:value={$Input}
      placeholder={'0.01-10000'}
      class={clsx(
        "px-2 pr-0", "w-full",
        "input focus:outline-none text-2xl font-bold text-right",
        $darkTheme ? "bg-gray-800 focus:border-none placeholder-stone-600" : "bg-stone-100 focus:border-stone-100 placeholder-stone-200"
      )}
    />
  </div>

  <!-- Max -->
  <div class="flex items-center justify-between mb-2">
    <button class={clsx("flex items-center border rounded-2xl")}>
      <span class="text-[10px] mx-2 my-0.5 capitalize">
        {$_('max')}
      </span>
    </button>
    
    {#if $Input}
      <span class={clsx("text-[10px] mx-2 my-0.5 capitalize opacity-60")}>
        {formatUSMoney(123*$Input)}
      </span>
    {/if}
  </div>
</div>