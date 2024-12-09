<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  $page.data.growInfo.then((res) => {
    goto(`/spot/${res.exchanges[0]}/${res.exchanges[0]}-USDT`)
  })
</script>