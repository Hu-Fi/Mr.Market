<script>
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { BN } from "$lib/helpers/utils";
  import { balances, balancesLoading } from "$lib/stores/admin";
  import { findCoinIconBySymbol, findExchangeIconByIdentifier } from "$lib/helpers/helpers";
  //@ts-expect-error types
  import { cleave } from "svelte-cleavejs"; // Import cleave directive
  import { maskOption } from "$lib/helpers/constants";

  let exchangeOptions = [];
  let selectedFromExchange = "";
  let selectedToExchange = "";
  let selectedFromAsset = "";
  let selectedToAsset = "";
  let amount = "";

  let fromExchangeMenuOpen = false;
  let toExchangeMenuOpen = false;
  let fromAssetMenuOpen = false;

  // Extract exchange and asset information from balances
  onMount(() => {
    if ($balances) {
      exchangeOptions = $balances.map(balance => ({
        name: balance.name,
        id: balance.key_id,
        exchange: balance.exchange,
        assets: Object.keys(balance.balance.free)
      }));
    }
  });

  function getBalance(exchange, asset) {
    const balanceObj = $balances.find(b => b.key_id === exchange.id);
    if (balanceObj && balanceObj.balance.free[asset]) {
      return BN(balanceObj.balance.free[asset]).toFormat();
    }
    return "0";
  }

  function handleTransfer() {
    if (selectedFromExchange && selectedToExchange && selectedFromAsset && selectedToAsset && amount) {
      console.log(`Transfer ${amount} from ${selectedFromExchange} (${selectedFromAsset}) to ${selectedToExchange} (${selectedToAsset})`);
      // Implement transfer logic here
    } else {
      alert("Please select all options and enter an amount for transfer.");
    }
  }

  function toggleMenu(menu) {
    menu = !menu;
  }

  function selectOption(type, value) {
    if (type === "fromExchange") {
      selectedFromExchange = value;
      selectedFromAsset = "";
      fromExchangeMenuOpen = false;
    } else if (type === "toExchange") {
      selectedToExchange = value;
      selectedToAsset = "";
      toExchangeMenuOpen = false;
    } else if (type === "fromAsset") {
      selectedFromAsset = value;
      fromAssetMenuOpen = false;
    }
  }
</script>

{#if $balancesLoading}
  <div class="flex items-center justify-center h-full">
    <span class="loading loading-spinner loading-md"></span>
  </div>
{:else}
  <div class="flex flex-col min-h-screen bg-base-100">
    <!-- Header -->
    <div class="flex items-center gap-2 p-4 bg-white">
      <!-- Arrow left -->
      <button class="btn btn-ghost btn-circle" on:click={() => { history.back() }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>
      <!-- Title -->
      <h1 class="text-xl font-bold">{$_("transfer")}</h1>
    </div>

    <!-- Transfer Form -->
    <div class="flex-grow flex justify-center items-start p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <!-- From Exchange -->
          <div class="form-control">
            <label class="label" for="from-exchange">
              <span class="label-text">{$_("from")}</span>
            </label>
            <div class="relative">
              <button
                class="btn font-normal bg-base-100 border-base-300 w-full flex items-center justify-between no-animation"
                on:click={() => fromExchangeMenuOpen = !fromExchangeMenuOpen}
              >
                <div class="flex items-center justify-start">
                  {#if selectedFromExchange}
                    <img src={findExchangeIconByIdentifier(selectedFromExchange.exchange)} alt={selectedFromExchange.exchange} class="w-6 h-6" />
                    <span class="ml-2">{selectedFromExchange.name} ({selectedFromExchange.exchange}-{selectedFromExchange.id})</span>
                  {:else}
                    {$_("select_exchange")}
                  {/if}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
              {#if fromExchangeMenuOpen}
                <ul class="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-auto">
                  {#each exchangeOptions.filter(item => item.id !== selectedFromExchange.id) as item}
                    <button class="w-full px-4 py-2 flex items-center justify-start hover:bg-gray-100 btn btn-ghost" on:click={() => selectOption('fromExchange', item)}>
                      <img src={findExchangeIconByIdentifier(item.exchange)} alt={item.exchange} class="w-6 h-6" />
                      <span class="ml-2">{item.name} ({item.exchange}-{item.id})</span>
                    </button>
                  {/each}
                </ul>
              {/if}
            </div>
          </div>

          <!-- From Asset -->
          <div class="form-control mt-4">
            <label class="label" for="from-asset">
              <span class="label-text">{$_("asset")}</span>
            </label>
            <div class="relative">
              <button
                class="btn font-normal bg-base-100 border-base-300 w-full flex items-center justify-between no-animation"
                on:click={() => fromAssetMenuOpen = !fromAssetMenuOpen}
                disabled={!selectedFromExchange}
              >
                <div class="flex items-center justify-start">
                  {#if selectedFromAsset}
                    <img src={findCoinIconBySymbol(selectedFromAsset)} alt={selectedFromAsset} class="w-6 h-6" />
                    <span class="ml-2">{selectedFromAsset} ({getBalance(selectedFromExchange, selectedFromAsset)})</span>
                  {:else}
                    {$_("select_asset")}
                  {/if}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
              {#if fromAssetMenuOpen && selectedFromExchange}
                <ul class="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-auto">
                  {#each exchangeOptions.find(e => e.id === selectedFromExchange.id).assets as asset}
                    <button
                      class="w-full px-4 py-2 flex items-center justify-start hover:bg-gray-100 btn btn-ghost"
                      on:click={() => selectOption('fromAsset', asset)}
                    >
                      <img src={findCoinIconBySymbol(asset)} alt={asset} class="w-6 h-6" />
                      <span class="ml-2">{asset} ({getBalance(selectedFromExchange, asset)})</span>
                    </button>
                  {/each}
                </ul>
              {/if}
            </div>
          </div>

          <!-- To Exchange -->
          <div class="form-control mt-4">
            <label class="label" for="to-exchange">
              <span class="label-text">{$_("to")}</span>
            </label>
            <div class="relative">
              <button
                class="btn font-normal bg-base-100 border-base-300 w-full flex items-center justify-between no-animation"
                on:click={() => toExchangeMenuOpen = !toExchangeMenuOpen}
              >
                <div class="flex items-center justify-start">
                  {#if selectedToExchange}
                    <img src={findExchangeIconByIdentifier(selectedToExchange.exchange)} alt={selectedToExchange.exchange} class="w-6 h-6" />
                    <span class="ml-2">{selectedToExchange.name} ({selectedToExchange.exchange}-{selectedToExchange.id})</span>
                  {:else}
                    {$_("select_exchange")}
                  {/if}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>
              {#if toExchangeMenuOpen}
                <ul class="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-auto">
                  {#each exchangeOptions.filter(item => item.id !== selectedFromExchange.id) as item}
                    <button
                      class="w-full px-4 py-2 flex items-center justify-start hover:bg-gray-100 btn btn-ghost"
                      on:click={() => selectOption('toExchange', item)}
                    >
                      <img src={findExchangeIconByIdentifier(item.exchange)} alt={item.exchange} class="w-6 h-6" />
                      <span class="ml-2">{item.name} ({item.exchange}-{item.id})</span>
                    </button>
                  {/each}
                </ul>
              {/if}
            </div>
          </div>

          <!-- Amount -->
          <div class="form-control mt-4">
            <label class="label" for="amount">
              <span class="label-text">{$_("amount")}</span>
            </label>
            <input
              type="text"
              class="input input-bordered w-full"
              bind:value={amount}
              use:cleave={maskOption}
              placeholder={$_("enter_amount")}
            />
          </div>

          <!-- Transfer Button -->
          <button class="btn bg-base-content hover:bg-base-content/80 text-base-100 mt-6" on:click={handleTransfer} disabled={!selectedToExchange || !selectedFromExchange || !selectedFromAsset || !amount}>
            {$_("transfer")}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
