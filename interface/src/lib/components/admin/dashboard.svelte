<script lang="ts">
  import Users from "$lib/components/admin/dashboard/users.svelte";
  import Stats from "$lib/components/admin/dashboard/stats.svelte";
  import Transactions from "$lib/components/admin/dashboard/transactions.svelte";
</script>

<div id="main-content" class="flex overflow-hidden bg-base-100 pt-8">
  <main class="mb-20">
    <div class="pt-6 px-4 flex flex-col space-y-4">
      <Stats />
      <Transactions />
      <Users />
    </div>
  </main>
</div>
