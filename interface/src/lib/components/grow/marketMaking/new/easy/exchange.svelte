<script lang="ts">
  import { _ } from "svelte-i18n";
  import { createMMEasyPair } from "$lib/stores/grow";
  import { findExchangeIconByIdentifier } from "$lib/helpers/helpers";
</script>

<!-- Exchange -->
<div class="flex flex-col space-y-4 mx-2">
  <div class="flex justify-between">
    <span class="text-sm capitalize">
      {$_('exchange')}
    </span>
  </div>

  <div class="flex items-center space-x-2">
    <div class="avatar">
      <div class="mask mask-squircle w-6 h-6">
        <img src={findExchangeIconByIdentifier($createMMEasyPair.exchange)} alt="" class="">
      </div>
    </div>
    <span class="font-semibold">
      {$createMMEasyPair.exchange}
    </span>
  </div>
</div>

<!-- Pair -->
<div class="flex flex-col space-y-4 mx-2">
  <div class="flex justify-between">
    <span class="text-sm">
      {$_('pair')}
    </span>
  </div>

  <div class="flex items-center space-x-2">
    <div class="avatar">
      <div class="mask mask-squircle w-6 h-6">
        <img src={findExchangeIconByIdentifier($createMMEasyPair.exchange)} alt="" class="">
      </div>
    </div>
    <span class="font-semibold">
      {$createMMEasyPair.symbol}
    </span>
  </div>
</div>