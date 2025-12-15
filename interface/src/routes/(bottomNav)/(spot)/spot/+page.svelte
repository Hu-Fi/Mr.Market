<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  ($page.data.growInfo as Promise<any>).then((res: any) => {
    goto(`/spot/${res.exchanges[0]}/${res.exchanges[0]}-USDT`);
  });
</script>
