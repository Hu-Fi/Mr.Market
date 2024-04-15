<script>
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { SUPPORTED_EXCHANGES } from "$lib/helpers/constants";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  import {
    createArbExchange1,
    createArbExchange2,
    selectArbExchange1Dialog,
    selectArbExchange2Dialog,
  } from "$lib/stores/grow";

  export let type = "1"; // 1 or 2
</script>

<dialog
  id="arb_select_exchange_1_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={type === "1"
    ? $selectArbExchange1Dialog
    : $selectArbExchange2Dialog}
>
  <div class="modal-box space-y-3 pt-0 px-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-4">
      <!-- Title -->
      <div class="flex justify-between px-6">
        <span class="font-semibold">
          {type === "1" ? $_("select_exchange_1") : $_("select_exchange_2")}
        </span>
        <button
          on:click={() => {
            type === "1"
              ? selectArbExchange1Dialog.set(false)
              : selectArbExchange2Dialog.set(false);
          }}
        >
          <!-- Close Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18 18 6M6 6l12 12"
            /></svg
          >
        </button>
      </div>

      <!-- Exchange list -->
      <div class="flex flex-col mt-4 space-y-1">
        {#each SUPPORTED_EXCHANGES as exchange, i}
          <button
            data-testid={`${type}-exchange-${i}`}
            class={clsx("flex space-x-2 rounded-full p-3 px-4 mx-3 bg-base-100",
              (type === '1' && exchange === $createArbExchange1) && "bg-base-300",
              (type === '2' && exchange === $createArbExchange2) && "bg-base-300",
              (type === '1' && exchange === $createArbExchange2) && "hidden",
              (type === '2' && exchange === $createArbExchange1) && "hidden",
            )}
            on:click={() => {
              if (type === "1") {
                createArbExchange1.set(exchange);
                selectArbExchange1Dialog.set(false);
              } else {
                createArbExchange2.set(exchange);
                selectArbExchange2Dialog.set(false);
              }
            }}
          >
            <div class="avatar">
              <div class="mask mask-circle w-6 h-6">
                <img src={findExchangeIconByIdentifier(exchange)} alt="" />
              </div>
            </div>
            <span class="capitalize font-normal"> {exchange} </span>
          </button>
        {/each}
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button
      on:click={() => {
        type === "1"
          ? selectArbExchange1Dialog.set(false)
          : selectArbExchange2Dialog.set(false);
      }}
    ></button>
  </form>
</dialog>
