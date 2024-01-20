<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
	import toast from 'svelte-french-toast';
  import { createNewAutoInvestAssets, createNewAutoInvestStep } from "$lib/stores/grow";

  const move = () => {
    if ($createNewAutoInvestStep === 0 && $createNewAutoInvestAssets.length === 0) {
      toast.error($_('please_select_an_asset'))
      return;
    }
    createNewAutoInvestStep.set($createNewAutoInvestStep + 1);
  };
</script>

<div
  class={clsx(
    "btm-nav btm-nav-xs h-[3.25rem] visible bg-transparent flex items-center justify-center mb-3",
  )}
>
  <div>
    <button
      class="btn btn-md w-36 !h-[2.5rem] border-none bg-blue-500 hover:bg-blue-500 rounded-full text-base-100 no-animation"
      on:click={() => {move()}}
    >
      <span>
        { $createNewAutoInvestStep === 2 ? $_('confirm') : $_("next_step") }
      </span>
    </button>
  </div>
</div>


