<script lang="ts">
  export let news = {id: 0, title: "Hufi goes live today", date: "2023-01-01", content:"Live"}
</script>

<div class="flex flex-col space-y-2 px-4 mt-4">
  <!-- Title -->
  <div>
    <span class="text-xl font-bold">{news.title}</span>
  </div>

  <!-- Date -->
  <div>
    <span class="text-xs font-normal opacity-60">{news.date}</span>
  </div>

  <!-- Content -->
  <div class="mt-4">
    <span class="text-sm">{news.content}</span>
  </div>
</div>