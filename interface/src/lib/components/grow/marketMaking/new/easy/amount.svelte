<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
	import { cleave } from 'svelte-cleavejs';
  import { maskOption } from "$lib/helpers/constants";
  import AssetIcon from "$lib/components/common/assetIcon.svelte";
  import { createMMEasyAmounts, createMMEasyPair } from "$lib/stores/grow";
</script>

<div class="flex flex-col space-y-2">
  <div class="flex justify-between mx-2">
    <span class="text-sm">
      {$_('amount')} 
    </span>
  </div>

  
  <div class="flex items-center justify-between space-x-2 mx-2">
    <div class="flex space-x-2">
      <AssetIcon assetIcon={$createMMEasyPair.baseIcon} chainIcon={$createMMEasyPair.targetIcon} clazz="w-6 h-6" claxx="w-2 h-2" />
      <span class="font-semibold">
        {$createMMEasyPair.base}
      </span>
    </div>
    <div class="border rounded-lg items-center">
      <input type="tel" use:cleave={maskOption} bind:value={$createMMEasyAmounts[0]} class={clsx("input focus:border-none focus:outline-none w-32")} />
    </div>
  </div>
  
  <div class="flex items-center justify-between space-x-2 mx-2">
    <div class="flex space-x-2">
      <AssetIcon assetIcon={$createMMEasyPair.targetIcon} chainIcon={$createMMEasyPair.targetIcon} clazz="w-6 h-6" claxx="w-2 h-2" />
      <span class="font-semibold">
        {$createMMEasyPair.target}
      </span>
    </div>
    <div class="border rounded-lg items-center">
      <input type="tel" use:cleave={maskOption} bind:value={$createMMEasyAmounts[1]} class={clsx("input focus:border-none focus:outline-none w-32")} />
    </div>
  </div>
</div>