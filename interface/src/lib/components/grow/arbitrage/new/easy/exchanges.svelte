<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { cleave } from "svelte-cleavejs";
  import { maskOption } from "$lib/helpers/constants";
  import {
    createArbAmount,
    createArbExchange1,
    createArbExchange2,
    createArbPair,
    selectArbExchange1Dialog,
    selectArbExchange2Dialog,
    selectArbPairDialog,
  } from "$lib/stores/grow";
  import {
    findCoinIconBySymbol,
    findExchangeIconByIdentifier,
  } from "$lib/helpers/helpers";
</script>

<div class="flex flex-col space-y-8">
  <!-- 1. Select both exchange -->
  <div class="flex flex-col space-y-2 mx-2">
    <span class="text-sm font-bold">
      {$_("exchange1")}
    </span>

    <div class="flex w-full">
      <button
        class="btn btn-block justify-between bg-base-100 border-base-300 no-animation"
        on:click={() => {
          selectArbExchange1Dialog.set(!$selectArbExchange1Dialog);
        }}
      >
        <div class="flex items-center space-x-2">
          {#if $createArbExchange1}
            <div class="avatar">
              <div class="mask mask-circle w-6 h-6">
                <img
                  src={findExchangeIconByIdentifier($createArbExchange1)}
                  alt=""
                />
              </div>
            </div>
          {/if}
          <span
            class={clsx(
              "capitalize font-medium",
              $createArbExchange1 ? "" : "opacity-40",
            )}
          >
            {$createArbExchange1
              ? $createArbExchange1
              : $_("select_exchange_1")}
          </span>
        </div>
        {#if !$selectArbExchange1Dialog}
          <!-- Caret down Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="opacity-40 h-4 w-4"
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
            class="opacity-40 h-4 w-4"
            ><path
              xmlns="http://www.w3.org/2000/svg"
              d="M7 14L12 8L17 14L7 14Z"
              fill="currentColor"
            ></path></svg
          >
        {/if}
      </button>
    </div>
  </div>

  <div class="flex flex-col space-y-2 mx-2">
    <span class="text-sm font-bold">
      {$_("exchange2")}
    </span>

    <div class="flex w-full">
      <button
        class="btn btn-block justify-between bg-base-100 border-base-300 no-animation"
        on:click={() => {
          selectArbExchange2Dialog.set(!$selectArbExchange2Dialog);
        }}
      >
        <div class="flex items-center space-x-2">
          {#if $createArbExchange2}
            <div class="avatar">
              <div class="mask mask-circle w-6 h-6">
                <img
                  src={findExchangeIconByIdentifier($createArbExchange2)}
                  alt=""
                />
              </div>
            </div>
          {/if}
          <span
            class={clsx(
              "capitalize font-medium",
              $createArbExchange2 ? "" : "opacity-40",
            )}
          >
            {$createArbExchange2
              ? $createArbExchange2
              : $_("select_exchange_2")}
          </span>
        </div>
        {#if !$selectArbExchange2Dialog}
          <!-- Caret down Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="opacity-40 h-4 w-4"
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
            class="opacity-40 h-4 w-4"
            ><path
              xmlns="http://www.w3.org/2000/svg"
              d="M7 14L12 8L17 14L7 14Z"
              fill="currentColor"
            ></path></svg
          >
        {/if}
      </button>
    </div>
  </div>
  <!-- 2. Select trading pair -->
  <div class="flex flex-col space-y-2 mx-2">
    <span class="text-sm font-bold">
      {$_("trading_pair")}
    </span>

    <div class="flex w-full">
      <button
        class="btn btn-block justify-between bg-base-100 border-base-300 no-animation"
        on:click={() => {
          selectArbPairDialog.set(!$selectArbPairDialog);
        }}
      >
        <span class={clsx("font-medium", $createArbPair ? "" : "opacity-40")}>
          {$createArbPair ? $createArbPair : $_("select_a_pair")}
        </span>
        {#if !$selectArbExchange2Dialog}
          <!-- Caret down Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            class="opacity-40 h-4 w-4"
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
            class="opacity-40 h-4 w-4"
            ><path
              xmlns="http://www.w3.org/2000/svg"
              d="M7 14L12 8L17 14L7 14Z"
              fill="currentColor"
            ></path></svg
          >
        {/if}
      </button>
    </div>
  </div>

  <!-- 3. Enter amount of each token -->
  {#if $createArbPair}
    <div class="flex flex-col space-y-2">
      <hr />
      {#each Array(2) as _, i}
        <div class="flex items-center justify-between space-x-2 mx-2">
          <div class="flex space-x-2">
            <img src={findCoinIconBySymbol($createArbPair.split("/")[i])} class="w-6 h-6" alt="" />
            <span class="font-semibold">
              {$createArbPair.split("/")[i]}
            </span>
          </div>
          <div class="join border rounded-lg items-center w-44">
            <input
              type="tel"
              use:cleave={maskOption}
              class={clsx(
                "input focus:border-none focus:outline-none join-item w-full",
              )}
              bind:value={$createArbAmount[i]}
            />
            <div class="join-item mr-2">
              <span class="text-sm opacity-60">
                {$createArbPair.split("/")[i]}
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- 4. Create arbitrage order, confirm payment -->

<!-- 5. Redirect to arbtirage details page -->
<style>
    hr {
        border-top: 1px solid #eeeeee;
        margin-left: 10px;
        margin-right: 10px;
        padding-bottom: 20px;
    }
</style>