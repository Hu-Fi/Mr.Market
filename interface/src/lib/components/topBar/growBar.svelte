<script lang="ts">
  import { _ } from "svelte-i18n";
  import MixinMenu from "$lib/components/common/MixinMenu.svelte";
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]">
  <div class="ml-4">
    <span class="font-bold">
      {$_('mm')}
    </span>
  </div>
  
  <div class="flex items-center space-x-4">
    <MixinMenu />
  </div>
</div>
