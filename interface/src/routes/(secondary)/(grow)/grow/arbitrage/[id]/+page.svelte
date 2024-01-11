<script lang="ts">
  import clsx from "clsx"
  import { _ } from "svelte-i18n"
  import { page } from "$app/stores";
</script>

<div class="p-5">
  {$page.params.id}
</div>

<style>

</style>