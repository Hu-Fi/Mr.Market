<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
	import { CandleChart, CandleActiveIndicators, CandleIndicatorDialog } from '$lib/stores/market';

  const toggleIndicator = (v: string, vv?: object) => {
    // If indicator enabled, disable it
    if ($CandleActiveIndicators.includes(v)) {
      $CandleChart.removeIndicator('candle_pane', v);
      CandleActiveIndicators.set($CandleActiveIndicators.filter(e => e !== v))
      return;
    }
    // If not enabled, enable it
    $CandleChart.createIndicator(vv ? vv : v, true, { id: 'candle_pane' })
    CandleActiveIndicators.set([...$CandleActiveIndicators, v])
  }
  const indicators = [
    {k: 'MA', v: 'MA', vv: {name:'MA', calcParams: [5, 10, 30]}},
    {k: 'EMA', v: 'EMA', vv: {name:'EMA', calcParams: [5, 10, 30]}},
    {k: 'SMA', v: 'SMA'},
    {k: 'MTM', v: 'MTM'},
    {k: 'WR', v: 'WR'},
    {k: 'CCI', v: 'CCI'},
    {k: 'BIAS', v: 'BIAS'},
    {k: 'VR', v: 'VR'},
    // {k: 'BRAR', v: 'BRAR'},
    // {k: 'BBI', v: 'BBI'},
    // {k: 'DMI', v: 'DMI'},
    // {k: 'EMV', v: 'EMV'},
    // {k: 'VOL', v: 'VOL'},
    // {k: 'CR', v: 'CR'},
    // {k: 'SAR', v: 'SAR'},
    // {k: 'MACD', v: 'MACD'},
    // {k: 'PSY', v: 'PSY'},
    // {k: 'AO', v: 'AO'},
    // {k: 'BOLL', v: 'BOLL'},
    // {k: 'DMA', v: 'DMA'},
    // {k: 'ROC', v: 'ROC'},
    // {k: 'KDJ', v: 'KDJ'},
    // {k: 'TRIX', v: 'TRIX'},
    // {k: 'PVT', v: 'PVT'},
    // {k: 'KDJRSI', v: 'KDJRSI'},
    // {k: 'TRIXOBV', v: 'TRIXOBV'},
    // {k: 'PVTAVP', v: 'PVTAVP'},
    // {k: 'RSI', v: 'RSI'},
    // {k: 'OBV', v: 'OBV'},
    // {k: 'AVP', v: 'AVP'},
  ]
</script>

<dialog id="candle_select_pair_modal" class="modal modal-bottom sm:modal-middle" class:modal-open={$CandleIndicatorDialog}>
  <div class="modal-box pt-0 px-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-20 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-slate-800/40 rounded-full">
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
        {#each indicators as i}
          <button 
            class={clsx("btn btn-xs rounded-sm bg-base-100 no-animation shadow-none", $CandleActiveIndicators.includes(i.v) && "bg-base-200 text-base-content")}
            on:click={()=>{toggleIndicator(i.v, i.vv); CandleIndicatorDialog.set(false)} }
          >
            <span> {i.k} </span>
          </button>
        {/each}
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={()=>CandleIndicatorDialog.set(false)}></button>
  </form>
</dialog>