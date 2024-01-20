<script lang="ts">
  import { page } from '$app/stores';
  import { _, locale } from "svelte-i18n"
  import newsEN from "../../../../../../assets/news/news-EN.json";
  import newsZH from "../../../../../../assets/news/news-ZH.json";
  import NewsDetail from '$lib/components/home/news/newsDetail.svelte';

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
  $: currentNews = activeNews.find(n => n.id === Number($page.params.id));
</script>

<div>
  <NewsDetail news={currentNews}/>
</div>