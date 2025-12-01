<script lang="ts">
  import { goto } from '$app/navigation';
  import { _ } from 'svelte-i18n';
</script>

<button
    class="btn bg-base-content text-base-100 w-32 no-animation rounded-full!"
  on:click={() => {
    goto("/market-making/create-new");
  }}
>
  {$_("create_new")}
</button>
