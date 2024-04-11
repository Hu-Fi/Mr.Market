<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { buy } from "$lib/stores/spot";
  import { UpColorBg, DownColorBg, FocusUpColorBg, FocusDownColorBg } from "$lib/helpers/constants";
</script>

<div class="flex space-x-[-10px] w-full">
  <button class={clsx("btn btn-sm border border-slate-300 buy-left no-animation w-[calc(50%+5px)] px-0 rounded-l-3xl", $buy ? `${UpColorBg} ${FocusUpColorBg}` : 'text-base-content bg-slate-50')} on:click={()=>{buy.set(true)}} data-testid="type_buy">
    <span class={clsx("mx-auto", $buy && "text-base-100")}>
      {$_("buy")}
    </span>
  </button>
  <button class={clsx("btn btn-sm border border-slate-300 sell-right no-animation w-[calc(50%+5px)] px-0 rounded-r-3xl", !$buy ? `${DownColorBg} ${FocusDownColorBg}` : 'text-base-content bg-slate-50')} on:click={()=>{buy.set(false)}} data-testid="type_sell">
    <span class={clsx("mx-auto", !$buy && "text-base-100")}>
      {$_("sell")}
    </span>
  </button>
</div>

<style>
  .buy-left {
    clip-path: polygon(0 0, 100% 0%, 85% 100%, 0% 100%);
  }
  .sell-right {
    clip-path: polygon(15% 0, 100% 0, 100% 100%, 0 100%);
  }
</style>