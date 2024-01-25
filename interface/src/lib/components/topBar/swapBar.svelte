<script lang="ts">
  import { _ } from "svelte-i18n"
  import MixinMenu from "../common/MixinMenu.svelte";
</script>

<div class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] !h-[36px] !min-h-[36px] mr-[6px]">
  <div class="pl-4 flex items-center">
    <span>
      {$_('swap')}
    </span>
  </div>  

  <div class="flex items-center space-x-4">
    <MixinMenu />
  </div>
</div>
