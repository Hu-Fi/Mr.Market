<script lang="ts">
  import SideBar from "./dashboard/sideBar.svelte";
  import MainContent from "./dashboard/mainContent.svelte";
</script>

<div class="flex">
  <div class="flex overflow-hidden bg-white pt-8">
    <SideBar />
    <MainContent />
  </div>
</div>
