<script lang="ts">
  import { _ } from "svelte-i18n"
  import { user } from "$lib/stores/wallet";  
  import { mixinConnected } from "$lib/stores/home";
</script>

{#if $mixinConnected}
  <div class="flex items-center mx-6 space-x-4 mt-4">
    <div class="avatar w-12 h-12 ">
      <img src={$user.avatar_url} alt="-" class="rounded-full" />
    </div>

    <div class="flex flex-col my-2 space-y-0">
      <div class="text-xl font-extrabold">
        <span> {$user.full_name} </span>
      </div>
      <div>
        <span class="text-xs !text-[11px] font-medium"> {$_('mixin_id', {values: {id: $user.identity_number} })} </span>
      </div>
    </div>
  </div>
{/if}