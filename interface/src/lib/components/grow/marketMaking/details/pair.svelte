<script lang="ts">
  import { _ } from "svelte-i18n";

  export let exchange = "";
  export let exchangeIcon = "";
  export let pairBase = "";
  export let pairTarget = "";
</script>

<div class="flex items-center w-full">
  <div class="flex flex-col w-full space-y-4">
    <span class="font-bold px-6 py-3 text-sm bg-gray-100 p-2">
      {$_("pair")}
    </span>

    <div class="py-2 px-5">
      <div
        class="flex items-center w-full justify-between capitalize space-x-3"
      >
        <div class="flex space-x-2 items-center">
          <img src={exchangeIcon} alt="" class="w-5 h-5" />
          <span> {exchange} </span>
        </div>
        <span class="font-medium">
          {pairBase}/{pairTarget}
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  .bg-gray-100 {
    background-color: #f8fafc;
  }
</style>
