<script lang="ts">
  import { _ } from "svelte-i18n";

  export let exchange = "";
  export let exchangeIcon = "";
  export let pairBase = "";
  export let pairTarget = "";
</script>

<div class="flex items-center p-6">
  <div class="flex flex-col w-full space-y-4">
    <span class="opacity-60 text-sm">
      {$_("pair")}
    </span>

    <div class="flex flex-col w-full items-start space-y-3">
      <div class="flex items-center w-full justify-between capitalize space-x-3">
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
