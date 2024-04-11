<script lang="ts">
  import { _ } from "svelte-i18n";

  export let exchange0 = "";
  export let exchange1 = "";
  export let pair0ExchangeIcon = "";
  export let pair1ExchangeIcon = "";
  export let pair0Base = "";
  export let pair0Target = "";
  export let pair1Base = "";
  export let pair1Target = "";
</script>

<div class="flex items-center w-full">
  <div class="flex flex-col w-full space-y-4 ">
    <span class="font-bold px-6 py-3 text-sm bg-gray-100 p-2">
      {$_("pair")}
    </span>

    <div class="flex  flex-col w-full items-start space-y-3 py-2 px-5">
      <!-- Pair 0 -->
      <div class="flex items-center w-full justify-between capitalize space-x-3">
        <div class="flex space-x-2 items-center">
          <img src={pair0ExchangeIcon} alt="" class="w-5 h-5" />
          <span> {exchange0} </span>
        </div>
        <span class="font-medium">
          {pair0Base}/{pair0Target}
        </span>
      </div>

      <!-- Pair 1 -->
      <div class="flex items-center w-full justify-between capitalize space-x-3">
        <div class="flex space-x-2 items-center">
          <img src={pair1ExchangeIcon} alt="" class="w-5 h-5" />
          <span> {exchange1} </span>
        </div>
        <span class="font-medium">
          {pair1Base}/{pair1Target}
        </span>
      </div>
    </div>
  </div>
</div>

<style>
    .bg-gray-100 {
        background-color: #F8FAFC;
    }
</style>