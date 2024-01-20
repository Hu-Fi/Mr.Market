<script lang="ts">
  import SelectPeriod from "$lib/components/dialogs/grow/autoInvest/selectPeriod.svelte";
  import SelectUnit from "$lib/components/dialogs/grow/autoInvest/selectUnit.svelte";
  import Create from "$lib/components/grow/autoInvest/new/create.svelte";
</script>

<div>
  <Create />
</div>

<SelectPeriod />
<SelectUnit />