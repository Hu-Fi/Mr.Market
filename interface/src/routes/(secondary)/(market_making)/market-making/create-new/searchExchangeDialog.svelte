<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { _ } from "svelte-i18n";
  import ExchangeIcon from "$lib/components/common/exchangeIcon.svelte";

  export let supportedExchanges: string[] = [];
  export let selectedExchange: string | null = null;
  export let onSelect: (exchange: string) => void = () => {};

  const dispatch = createEventDispatcher();
  let searchTerm = "";
  let dialogRef: HTMLDialogElement | null = null;

  const sanitize = (value: string) => value?.toLowerCase().trim();

  $: normalizedExchanges = Array.from(
    new Map(
      supportedExchanges
        .filter(Boolean)
        .map((name) => [sanitize(name), name])
    ).values()
  );

  $: filteredExchanges =
    searchTerm.trim().length === 0
      ? normalizedExchanges
      : normalizedExchanges.filter((exchange) =>
          sanitize(exchange)?.includes(sanitize(searchTerm) ?? "")
        );

  const handleSelect = (exchange: string) => {
    onSelect(exchange);
    dispatch("select", { value: exchange });
    dialogRef?.close();
  };
</script>

<dialog
  id="mm_search_exchange"
  class="modal modal-bottom sm:modal-middle"
  bind:this={dialogRef}
>
  <div class="modal-box p-0 h-[70vh] max-h-[70vh] flex flex-col gap-0">
    <div class="px-5 py-4 border-b border-base-200 flex items-center justify-between">
      <h3 class="text-base font-semibold">{$_("select_exchanges")}</h3>
      <button class="btn btn-xs btn-ghost" type="button" on:click={() => dialogRef?.close()}>
        ✕
      </button>
    </div>

    <div class="px-5 py-4 border-b border-base-200">
      <label class="input input-sm input-bordered rounded-full flex items-center gap-2 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
        </svg>
        <input
          type="text"
          placeholder={$_("search")}
          bind:value={searchTerm}
          class="grow rounded-full"
        />
      </label>
    </div>

    <div class="px-5 py-3 overflow-y-auto flex-1 space-y-2">
      {#if filteredExchanges.length > 0}
        {#each filteredExchanges as exchange}
          <button
            type="button"
            class={`w-full px-3 py-3 text-left border transition-all border-slate-200 rounded-2xl`}
            on:click={() => handleSelect(exchange)}
          >
            <div class="flex items-center gap-2">
              <ExchangeIcon
                exchangeName={exchange}
                clazz="w-10 h-10 rounded-full border border-base-200 bg-base-100 p-1"
              />
              <span class="capitalize font-medium">{exchange}</span>
            </div>
          </button>
        {/each}
      {:else}
        <div class="text-center text-sm text-base-content/70 py-10">
          {$_("no_exchanges_found")}
        </div>
      {/if}
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>{$_("close")}</button>
    </form>
  </div>
</dialog>