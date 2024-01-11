<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { formatUSNumber } from "$lib/helpers/utils";
  import { pair, pairSearch, pairSelectorDialog } from "$lib/stores/trade";

  let activeTab = 0
  let items = [
    {name: $_("favorites"), fn: ()=>{}},
    {name: $_("all"), fn: ()=>{}},
    {name: $_("top"), fn: ()=>{}},
    {name: $_("favorites"), fn: ()=>{}},
    {name: $_("all"), fn: ()=>{}},
    {name: $_("top"), fn: ()=>{}},
  ]

  $: placeholders = [
    {first: "BTC", second: "USDT", price: 43576, percentage: -0.87, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "ETH", second: "USDT", price: 2288, percentage: -1.58, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "SOL", second: "USDT", price: 95.55, percentage: +20.21, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "BNB", second: "USDT", price: 253, percentage: -0.63, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "SUI", second: "USDT", price: 0.7299, percentage: +4.9, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "UNI", second: "USDT", price: 43576, percentage: -0.87, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "BTC", second: "USDT", price: 43576, percentage: -0.87, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "ETH", second: "USDT", price: 2288, percentage: -1.58, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "SOL", second: "USDT", price: 95.55, percentage: +20.21, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "BNB", second: "USDT", price: 253, percentage: -0.63, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "SUI", second: "USDT", price: 0.7299, percentage: +4.9, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
    {first: "UNI", second: "USDT", price: 43576, percentage: -0.87, favorite: false, icon: "https://static-00.iconduck.com/assets.00/binance-coin-cryptocurrency-icon-512x512-aacfkhah.png", "exchange": "binance"},
  ].filter((item) => {
    return (
      item.first.toUpperCase().match($pairSearch.toUpperCase()) ||
      item.second.toUpperCase().match($pairSearch.toUpperCase()) ||
      item.exchange.toUpperCase().match($pairSearch.toUpperCase())
    );
  })
</script>

<dialog id="select_pair_modal" class="modal modal-bottom sm:modal-middle" class:modal-open={$pairSelectorDialog}>
  <div class="modal-box h-[90vh] pt-0 px-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-20 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-base-content/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={()=>pairSelectorDialog.set(false)}>c</button>
          </form>
        </div>
      </div>

      <!-- Search -->
      <div class="join w-full px-3">
        <!-- Search Icon -->
        <div class="bg-base-200 join-item flex items-center rounded-full pl-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
        </div>
        <input bind:value={$pairSearch} class="input input-md h-[2.5rem] w-full pl-2 focus:outline-none focus:border-0 rounded-full bg-base-200 join-item" placeholder={$_('search')} />
      </div>

      <!-- Tabs -->
      <div class="tabs border-b w-full mt-3 px-3 overflow-x-auto no-scrollbar">
        {#each items as item, i}
          <button class={clsx("tab", activeTab === i && "border-b border-base-content")} on:click={()=>{activeTab=i; item.fn()}}>
            <span class={clsx("font-medium", activeTab === i ? "opacity-100" : "opacity-60")}>{item.name}</span>
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Pairs -->
    <div class="flex flex-col overflow-y-auto mt-0 px-3">
      {#each placeholders as c}
      <div class="w-full flex items-center justify-start space-x-2 py-3">
        <button class="flex justify-between w-full items-center" data-dismiss="select_pair_modal" on:click={()=>{pair.set(c);pairSelectorDialog.set(false);}}>
          <div class="flex items-center space-x-3">
            <img src={c.icon} alt="-" loading="lazy" class="w-5 h-5" />
            <span class="flex items-center font-semibold text-sm">
              {c.first}<span class="font-light text-xs text-base-content/60">/{c.second}</span>
            </span>
          </div>
  
            <div class="flex flex-col items-end">
              <span class="text-md font-semibold">
                {formatUSNumber(c.price)}
              </span>
              <!-- TODO: replace with variable theme color -->
              <span class={clsx("text-xs !text-[10px]", c.percentage >= 0 ? 'text-green-600' : 'text-red-600')}>
                {c.percentage}%
              </span>
            </div>
          </button>
        </div>
      {/each}
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={()=>pairSelectorDialog.set(false)}></button>
  </form>
</dialog>