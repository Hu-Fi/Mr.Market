<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import type { CandleTabs } from "$lib/types/hufi/exchanges";
  import { socket } from '$lib/stores/spot';
  import { switchCandleStickTimeFrame } from '$lib/helpers/hufi/socket';
	import { CandleChart, CandleTimeRange, CandleTimeRangeDialog } from '$lib/stores/market';

  const ranges: CandleTabs = [  
    {k:$_('1m'), v: '1m'},
    {k:$_('5m'), v: '5m'},
    {k:$_('15m'),v: '15m'},
    {k:$_('30m'),v: '30m'},
    {k:$_('1h'), v: '1h'},
    {k:$_('4h'), v: '4h'},
    {k:$_('1d'), v: '1d'},
    {k:$_('1w'), v: '1w'},
    {k:$_('1M'), v: '1M'},
  ]
</script>

<dialog id="candle_select_pair_modal" class="modal modal-bottom sm:modal-middle" class:modal-open={$CandleTimeRangeDialog}>
  <div class="modal-box pt-0 px-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-20 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-slate-800/40 rounded-full">
          <form method="dialog" class="modal-backdrop">
            <button on:click={()=>CandleTimeRangeDialog.set(false)}>c</button>
          </form>
        </div>
      </div>
    </div>

    <div class="flex flex-col space-y-6">
      <div class="mx-4">
        <span class="font-semibold">
          {$_('intervals')}
        </span>
      </div>
      <div class="grid grid-cols-4 gap-4 mx-4">
        {#each ranges as tab}
          <button 
            class={clsx("btn btn-xs rounded-md bg-base-100 no-animation shadow-none", $CandleTimeRange.v === tab.v && "bg-base-200 text-base-content")}
            on:click={async ()=>{
              CandleTimeRangeDialog.set(false)
              const data = await switchCandleStickTimeFrame($socket, tab);
              $CandleChart.applyNewData(data);
            } }
          >
            <span> {tab.k} </span>
          </button>
        {/each}
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={()=>CandleTimeRangeDialog.set(false)}></button>
  </form>
</dialog>