<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
	import toast from 'svelte-french-toast';
  import { createAIAmounts, createAIAssets, createAIName, createAIPeriod } from "$lib/stores/grow";

  const move = () => {
    if ($page.url.pathname.includes('/grow/auto_invest/new/one') && $createAIAssets.length === 0) {
      toast.error($_('please_select_an_asset'), {position:'bottom-center', duration: 2000})
      return;
    }
    if ($page.url.pathname.includes('/grow/auto_invest/new/one')) {
      goto('/grow/auto_invest/new/two')
      return;
    }
    if ($page.url.pathname.includes('/grow/auto_invest/new/two')) {
      CheckAllFields()
      // ConfirmNewAI()
      return;
    }
  };

  const CheckAllFields = () => {
    // Check assets
    if ($createAIAssets.length === 0) { toast.error($_('please_fill_out_field_x', {values:{name: $_('asset')}}), {position:'bottom-center', duration: 2000}); return }
    // Check name
    if ($createAIName.length === 0) { toast.error($_('please_fill_out_field_x', {values:{name: $_('name')}}), {position:'bottom-center', duration: 2000}); return }
    // Check period
    if ($createAIPeriod === 0) { toast.error($_('please_fill_out_field_x', {values:{name: $_('period')}}), {position:'bottom-center', duration: 2000}); return }
    // Check amounts
    if ($createAIAmounts.length === 0) { toast.error($_('please_fill_out_field_x', {values:{name: $_('amount')}}), {position:'bottom-center', duration: 2000}); return }
    // Check length
    if ($createAIAmounts.length != $createAIAssets.length) { toast.error($_('please_fill_out_field_x', {values:{name: $_('amount')}}), {position:'bottom-center', duration: 2000}); return }
    // Check all amounts
    for (let i = 0; i<$createAIAmounts.length; i++) {
      if (!$createAIAmounts[i]) {
        toast.error($_('please_fill_out_field_x', { values:{ name: $_('amount') } } ), {position:'bottom-center', duration: 2000} ); return
      }
    }
  }
</script>

<div
  class={clsx(
    "btm-nav btm-nav-xs h-[3.25rem] visible bg-transparent flex items-center justify-center mb-3",
  )}
>
  <div>
    <button
      class="btn btn-md w-36 !h-[2.5rem] border-none bg-slate-800 hover:bg-slate-800 rounded-full text-base-100 no-animation"
      on:click={() => {move()}}
    >
      <span>
        { $page.url.pathname.includes('/grow/auto_invest/new/two') ? $_('confirm') : $_("next_step") }
      </span>
    </button>
  </div>
</div>