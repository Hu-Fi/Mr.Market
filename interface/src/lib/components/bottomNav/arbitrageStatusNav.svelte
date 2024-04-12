<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n"
  import { editArbitrageDialog } from "$lib/stores/grow";

  // use $currentArbitrageStatus for status
  export let statusStop = true;
  let statusStopLoading = false;

  const toggleArbitrage = () => {
    statusStopLoading = true;
    setTimeout(() => {
      statusStop = !statusStop;
      statusStopLoading = false;
    }, 2000);
  }
</script>

<div class="btm-nav btm-nav-md shadow-2xl bg-base-100 visible md:invisible px-4">
  <div class="flex flex-row justify-start space-x-2">  
    <!-- Stop/Delete Button -->
    <button class="btn bg-base-100 hover:bg-base-100 border-base-300 no-animation flex border items-center justify-center rounded-full space-x-0 px-6 min-w-32" on:click={()=>{toggleArbitrage()}}>
      {#if statusStop}
        <div class={clsx("flex items-center space-x-2",statusStopLoading && "loading")}>
          <svg name="pause" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
          </svg>
          <span> {$_('stop')} </span>
        </div>
      {:else}
        <div class={clsx("flex items-center space-x-2",statusStopLoading && "loading")}>
          <svg name="play" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
          <span> {$_('resume')} </span>
        </div>
      {/if}
    </button>

    <!-- Add/Remove button -->
    <button 
      class="btn bg-slate-800 border-base-300 hover:bg-slate-800 hover:border-base-300 no-animation flex items-center justify-center rounded-full focus:bg-slate-800 focus:border-base-300 grow" 
      on:click={()=>{editArbitrageDialog.set(true)}}
    >
      <div class="flex items-center justify-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 stroke-base-100">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>        
        <span class="capitalize font-semibold text-base-100"> {$_('edit')} </span>
      </div>
    </button>
  </div>
</div>