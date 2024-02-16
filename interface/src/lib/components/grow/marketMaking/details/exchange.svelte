<script lang="ts">
  import { _ } from "svelte-i18n";
  import PairIcon from "$lib/components/common/pairIcon.svelte";

  export let exchange = "";
  export let exchangeIcon = '';
</script>

<div class="flex items-center justify-between p-6 mt-2">
  <div class="flex flex-col space-y-4">
    <span class="opacity-60 text-sm">
      {$_("exchange")}
    </span>

    <div class="flex items-center space-x-1 capitalize">
      <span class="text-xl font-semibold"> 
        {exchange}
      </span>
    </div>
  </div>

  <div>
    <img src={exchangeIcon} alt="" class="w-9 h-9" />
  </div>
</div>