<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { CandleTabActive } from "$lib/stores/market";

  const tabs = [
    {title: $_("chart"), fn: ()=>{}},
    {title: $_("overview"), fn: ()=>{}},
    {title: $_("data"), fn: ()=>{}},
    {title: $_("trade"), fn: ()=>{}},
  ]
</script>

<div class="flex space-x-2 ml-2">
  {#each tabs as t, i}
    <button class={clsx("btn-sm", $CandleTabActive === i ? "opacity-100" : "opacity-60")} on:click={()=>CandleTabActive.set(i)}>
      <span class="text-sm font-semibold"> {t.title} </span>
    </button>
  {/each}
</div>

<style>

</style>