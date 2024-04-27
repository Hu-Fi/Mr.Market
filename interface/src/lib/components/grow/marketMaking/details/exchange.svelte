<script lang="ts">
  import { _ } from "svelte-i18n";

  export let exchange = "";
  export let exchangeIcon = '';
</script>

<div class="flex items-center w-full justify-between p-6 mt-2 text-center bg-gray-100">
  <div class="flex flex-col m-auto space-y-2">
    <span class="text-xl font-bold t">
      {$_("exchange")}
    </span>
    <div class="m-auto">
      <img src={exchangeIcon} class="w-9 h-9" alt="exchange" />
    </div>
    <div class="flex items-center justify-center space-x-1 capitalize">
      <span class="text-xl font-bold text-center">
        {exchange}
      </span>
    </div>
  </div>
</div>

<style>
  div.bg-gray-100 {
      background-color: #F8FAFC;
  }
</style>
