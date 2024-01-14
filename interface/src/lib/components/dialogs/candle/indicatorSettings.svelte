<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
	import { CandleChart, CandleIndicatorDialog } from '$lib/stores/market';

  const toggleIndicator = (name: string) => {
    
  }
  const ranges = [
    {k: 'MA', v: 'MA', fn: ()=>{}},
    {k: 'BIAS', v: 'BIAS', fn: ()=>{}},
    {k: 'VR', v: 'VR', fn: ()=>{}},
    {k: 'EMA', v: 'EMA', fn: ()=>{}},
    {k: 'BRAR', v: 'BRAR', fn: ()=>{}},
    {k: 'WR', v: 'WR', fn: ()=>{}},
    {k: 'SMA', v: 'SMA', fn: ()=>{}},
    {k: 'CCI', v: 'CCI', fn: ()=>{}},
    {k: 'MTM', v: 'MTM', fn: ()=>{}},
    // {k: 'BBI', v: 'BBI', fn: ()=>{}},
    // {k: 'DMI', v: 'DMI', fn: ()=>{}},
    // {k: 'EMV', v: 'EMV', fn: ()=>{}},
    // {k: 'VOL', v: 'VOL', fn: ()=>{}},
    // {k: 'CR', v: 'CR', fn: ()=>{}},
    // {k: 'SAR', v: 'SAR', fn: ()=>{}},
    // {k: 'MACD', v: 'MACD', fn: ()=>{}},
    // {k: 'PSY', v: 'PSY', fn: ()=>{}},
    // {k: 'AO', v: 'AO', fn: ()=>{}},
    // {k: 'BOLL', v: 'BOLL', fn: ()=>{}},
    // {k: 'DMA', v: 'DMA', fn: ()=>{}},
    // {k: 'ROC', v: 'ROC', fn: ()=>{}},
    // {k: 'KDJ', v: 'KDJ', fn: ()=>{}},
    // {k: 'TRIX', v: 'TRIX', fn: ()=>{}},
    // {k: 'PVT', v: 'PVT', fn: ()=>{}},
    // {k: 'KDJRSI', v: 'KDJRSI', fn: ()=>{}},
    // {k: 'TRIXOBV', v: 'TRIXOBV', fn: ()=>{}},
    // {k: 'PVTAVP', v: 'PVTAVP', fn: ()=>{}},
    // {k: 'RSI', v: 'RSI', fn: ()=>{}},
    // {k: 'OBV', v: 'OBV', fn: ()=>{}},
    // {k: 'AVP', v: 'AVP', fn: ()=>{}},
  ]
</script>

<dialog id="candle_select_pair_modal" class="modal modal-bottom sm:modal-middle" class:modal-open={$CandleIndicatorDialog}>
  <div class="modal-box pt-0 px-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-20 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-base-content/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={()=>CandleIndicatorDialog.set(false)}>c</button>
          </form>
        </div>
      </div>      
    </div>

    <div class="flex flex-col space-y-6">
      <div class="mx-4">
        <span class="font-semibold">
          {$_('indicators')}
        </span>
      </div>
      <div class="grid grid-cols-4 gap-4 mx-4">
        {#each ranges as r}
          <button 
            class={clsx("btn btn-xs rounded-sm bg-base-100 no-animation shadow-none", false && "bg-base-200 text-base-content")}
            on:click={()=>{CandleIndicatorDialog.set(false)} }
          >
            <span> {r.k} </span>
          </button>
        {/each}
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={()=>CandleIndicatorDialog.set(false)}></button>
  </form>
</dialog>