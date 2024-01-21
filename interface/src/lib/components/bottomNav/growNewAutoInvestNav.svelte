<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
	import toast from 'svelte-french-toast';
  import { createAIAmounts, createAIAssets, createAIName, createAIPeriod } from "$lib/stores/grow";

  const move = () => {
    if ($page.url.pathname.includes('/grow/auto_invest/new/one') && $createAIAssets.length === 0) {
      toast.error($_('please_select_an_asset'), {duration: 3000})
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
    if ($createAIAssets.length === 0) { toast.error($_('please_fill_out_field_x', {values:{name: $_('asset')}})); return }
    // Check name
    if ($createAIName.length === 0) { toast.error($_('please_fill_out_field_x', {values:{name: $_('name')}})); return }
    // Check period
    if ($createAIPeriod === 0) { toast.error($_('please_fill_out_field_x', {values:{name: $_('period')}})); return }
    // Check amounts
    if ($createAIAmounts.length === 0) { toast.error($_('please_fill_out_field_x', {values:{name: $_('amount')}})); return }
    $createAIAmounts.forEach(
      (e)=>{
        if(e == 0) { toast.error($_('please_fill_out_field_x', { values:{ name: $_('amount') } } ) ); return }
      }
    )
  }
</script>

<div
  class={clsx(
    "btm-nav btm-nav-xs h-[3.25rem] visible bg-transparent flex items-center justify-center mb-3",
  )}
>
  <div>
    <button
      class="btn btn-md w-36 !h-[2.5rem] border-none bg-base-content hover:bg-base-content rounded-full text-base-100 no-animation"
      on:click={() => {move()}}
    >
      <span>
        { $page.url.pathname.includes('/grow/auto_invest/new/two') ? $_('confirm') : $_("next_step") }
      </span>
    </button>
  </div>
</div>


