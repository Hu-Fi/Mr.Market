<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { createAIPeriod, createAIPeriodDialog } from "$lib/stores/grow";

  let expanded = false;
  let easyTabs = [
    {name: $_("daily"), value: 24, fn: () => {createAIPeriod.set(24)}},
    {name: $_("weekly"), value: 7*24, fn: () => {createAIPeriod.set(7*24)}},
    {name: $_("monthly"), value: 30*24, fn: () => {createAIPeriod.set(30*24)}},
  ]
</script>

<dialog
  id="auto_invest_select_period_modal"
  class="modal modal-bottom sm:modal-middle"
  class:modal-open={$createAIPeriodDialog}
>
  <div class="modal-box space-y-3 pt-0">
    <div class="sticky top-0 bg-opacity-100 bg-base-100 z-10 pt-4">
      <!-- Close -->
      <div class="flex justify-end">
        <button on:click={() => createAIPeriodDialog.set(false)}>
          <!-- Close Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
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
    </div>

    <div class="flex flex-col space-y-8">
      <!-- Select Period -->
      <div>
        <!-- Easy -->
        <div class="mb-3">
          <span class="text-sm font-semibold"> {$_("period")} </span>
        </div>
        
        <div class="grid grid-cols-3 join w-full">
          {#each easyTabs as tab}
            <button class={clsx("btn btn-sm no-animation join-item", $createAIPeriod === tab.value && "bg-slate-800 border-base-content focus:bg-slate-800 hover:bg-slate-800 text-base-100")} on:click={()=>{createAIPeriod.set(tab.value)}}>
              <span> {tab.name} </span>
            </button>
          {/each}
        </div>
      </div>

      {#if expanded}
        <div>
          <!-- Longer period -->
          <div class="mb-3">
            <span class="text-sm font-semibold"> {$_("longer_period")} </span>
          </div>
          
          <div class="grid grid-cols-3 justify-center text-center items-center px-4 join w-full border border-base-300">
            <span class="text-xs"> {$_('every')} </span>
            <input class="input input-sm focus:border-none focus:outline-none" placeholder={
              $createAIPeriod === 24 ? '1-365' :
              $createAIPeriod === 7*24 ? '1-52' :
              $createAIPeriod === 30*24 ? '1-12' : ''
            } />
            <span class="text-xs"> 
              {
                $createAIPeriod === 24 ? $_('dayss') :
                $createAIPeriod === 7*24 ? $_('weeks') :
                $createAIPeriod === 30*24 ? $_('months') : $_('period')
              } 
            </span>
          </div>
        </div>

        <div>
          <!-- exact time -->
          <div class="mb-3">
            <span class="text-sm font-semibold"> {$_("exact_time")} </span>
          </div>
          
          <div class="grid grid-cols-4 justify-center text-center items-center px-4 join w-full border border-base-300">
            <span class="text-xs"> {$_('hour')} </span>
            <input class="input input-sm focus:border-none focus:outline-none" placeholder="0-23" />
            <span class="text-xs">  { $_('minute') }  </span>
            <input class="input input-sm focus:border-none focus:outline-none" placeholder="0-60" />
          </div>
        </div>
      {/if}

      <div>
        <!-- More options -->
        <div class="mb-3">
          <span class="text-sm font-semibold"> {$_("more_options")} </span>
        </div>
        
        <div class="w-full">
          <input type="checkbox" class="toggle" bind:checked={expanded} />
        </div>
      </div>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button on:click={() => createAIPeriodDialog.set(false)}></button>
  </form>
</dialog>
