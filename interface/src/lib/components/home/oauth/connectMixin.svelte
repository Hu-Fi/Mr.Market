<script lang="ts">
  import { _ } from "svelte-i18n"
  import ConnectWalletBtn from "$lib/components/common/connectWalletBtn.svelte";
</script>

<div class="flex items-center justify-between p-4 rounded-2xl mt-1">
  <div class="flex flex-col justify-center">
    <!-- Title -->
    <div class="flex items-center space-x-1 opacity-60">
      <span class="text-sm font-normal">
        {$_('total_balance')}
      </span>
    </div>
  
    <!-- Amount -->
    <div class="flex items-end space-x-2 mt-2 pb-1">
      <div class="flex items-end space-x-1">
        <span class="text-2xl font-extrabold break-words">
          *****
        </span>
      </div>
    </div>
  </div>
  <!-- Right -->
  <ConnectWalletBtn clazz="" />
</div>