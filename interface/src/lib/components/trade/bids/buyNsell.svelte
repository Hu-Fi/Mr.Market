<script lang="ts">
  import clsx from "clsx";
  import { _ } from "svelte-i18n";
  import { buy } from "$lib/stores/trade";
  import { UpColorBg, DownColorBg, FocusUpColorBg, FocusDownColorBg } from "$lib/helpers/constants";
</script>

<div class="flex space-x-[-10px] w-full">
  <button class={clsx("btn btn-sm buy-left no-animation w-[calc(50%+5px)] px-0 rounded-l-3xl", $buy &&  `${UpColorBg} ${FocusUpColorBg}`)} on:click={()=>{buy.set(true)}} data-testid="type_buy">
    <span class={clsx("mx-auto", $buy && "text-base-100")}>
      {$_("buy")}
    </span>
  </button>
  <button class={clsx("btn btn-sm sell-right no-animation w-[calc(50%+5px)] px-0 rounded-r-3xl", !$buy && `${DownColorBg} ${FocusDownColorBg}`)} on:click={()=>{buy.set(false)}} data-testid="type_sell">
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