<script>
  import { page } from "$app/stores";

  console.log($page.params.id)
</script>

<div>
  {$page.params.id}
</div>