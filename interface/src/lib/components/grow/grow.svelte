<script lang="ts">
  import Entrance from "./elements/entrance.svelte";
  import Ongoing from "./elements/ongoing.svelte";
  import GrowAddMore from "$lib/components/dialogs/grow/growAddMore.svelte";
</script>

<div class="flex flex-col space-y-5">
  <Entrance />
</div>
<Ongoing />

<GrowAddMore />