<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
	import { CandleTimeRange, CandleTimeRangeDialog } from '$lib/stores/market';

  const ranges = [  
    {k:$_('1s'), v: 1, fn:()=>{  }},
    {k:$_('1min'), v: 1*60, fn:()=>{  }},
    {k:$_('3min'), v: 3*60, fn:()=>{  }},
    {k:$_('5min'), v: 5*60,fn:()=>{  }},
    {k:$_('15m'), v: 15*60,  fn:()=>{  }},
    {k:$_('30m'), v: 30*60,  fn:()=>{  }},
    {k:$_('1hr'), v: 60*60,  fn:()=>{  }},
    {k:$_('2hr'), v: 2*60*60,  fn:()=>{  }},
    {k:$_('4hr'), v: 4*60*60, fn:()=>{  }},
    {k:$_('1d'), v: 24*60*60, fn:()=>{  }},
    {k:$_('2d'), v: 2*24*60*60,fn:()=>{  }},
    {k:$_('3d'), v: 3*24*60*60,  fn:()=>{  }},
    {k:$_('5d'), v: 5*24*60*60,  fn:()=>{  }},
    {k:$_('1w'), v: 7*24*60*60,  fn:()=>{  }},
    {k:$_('1m'), v: 30*24*60*60,  fn:()=>{  }},
  ]
</script>

<dialog id="candle_select_pair_modal" class="modal modal-bottom sm:modal-middle" class:modal-open={$CandleTimeRangeDialog}>
  <div class="modal-box pt-0 px-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-20 pt-6">
      <!-- Close -->
      <div class="absolute left-[calc(50%-16px)] top-2">
        <div class="w-8 h-1 bg-base-content/40 rounded-full">
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
        {#each ranges as r}
          <button 
            class={clsx("btn btn-xs rounded-sm bg-base-100 no-animation shadow-none", $CandleTimeRange === r.v && "bg-base-200 text-base-content")}
            on:click={()=>{CandleTimeRange.set(r.v); CandleTimeRangeDialog.set(false)} }
          >
            <span> {r.k} </span>
          </button>
        {/each}
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={()=>CandleTimeRangeDialog.set(false)}></button>
  </form>
</dialog>