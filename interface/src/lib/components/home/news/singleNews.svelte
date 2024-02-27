<script lang="ts">
  import { goto } from "$app/navigation";

  export let news = {id: 0, title: "Hufi goes live today", date: "2023-01-01", content:"Live"}
</script>

<button class="flex flex-col text-left" on:click={()=>goto(`/home/news/${news.id}`)}>
  <!-- Title -->
  <div>
    <span class="text-sm font-bold">{news.title}</span>
  </div>

  <!-- Date -->
  <div>
    <span class="text-xs font-normal opacity-60">{news.date}</span>
  </div>
</button>