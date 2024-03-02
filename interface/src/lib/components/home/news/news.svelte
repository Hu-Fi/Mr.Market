<script lang="ts">
  import { locale } from "svelte-i18n"
  import SingleNews from "./singleNews.svelte";
  import newsEN from "../../../../assets/news/news-EN.json";
  import newsZH from "../../../../assets/news/news-ZH.json";

  const getNewsByLang = () => {
    switch ($locale) {
      case "en-US":
        return newsEN
      case "zh-CN":
      case "zh-HK":
      case "zh-TW":
        return newsZH
      default:
        return newsEN
    }
  }
  $: activeNews = getNewsByLang()
</script>

<div class="flex flex-col space-y-3 mt-4">
  <div class="flex flex-col space-y-4 px-4">
    {#each activeNews as n}
      <SingleNews news={n} />
    {/each}
  </div>
</div>