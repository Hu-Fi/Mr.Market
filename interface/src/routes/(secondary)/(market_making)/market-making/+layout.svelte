<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import MixinMenu from "$lib/components/common/MixinMenu.svelte";
  import LearnMarketMakingBtn from "$lib/components/grow/marketMaking/createNew/exchange/learnMarketMakingBtn.svelte";

  const navigate = (updater: (url: URL) => void) => {
    const nextUrl = new URL($page.url);
    updater(nextUrl);
    goto(nextUrl.pathname + nextUrl.search, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };

  const handleBack = () => {
    const currentUrl = $page.url;
    const exchange = currentUrl.searchParams.get("exchange");
    const tradingPair = currentUrl.searchParams.get("trading_pair");
    const baseAmount = currentUrl.searchParams.get("base_amount");
    const quoteAmount = currentUrl.searchParams.get("quote_amount");

    // Confirm payment -> Enter amount
    if (exchange && tradingPair && baseAmount && quoteAmount) {
      navigate((url) => {
        url.searchParams.delete("base_amount");
        url.searchParams.delete("quote_amount");
      });
      return;
    }

    // Enter amount -> Select trading pair
    if (exchange && tradingPair && (!baseAmount || !quoteAmount)) {
      navigate((url) => {
        url.searchParams.delete("trading_pair");
        url.searchParams.delete("base_amount");
        url.searchParams.delete("quote_amount");
      });
      return;
    }

    // Select trading pair -> Select exchange
    if (exchange && !tradingPair) {
      navigate((url) => {
        url.searchParams.delete("exchange");
        url.searchParams.delete("trading_pair");
        url.searchParams.delete("base_amount");
        url.searchParams.delete("quote_amount");
      });
      return;
    }

    // Default back to the market-making landing page
    goto("/market-making", {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };
</script>

<header class="sticky top-0 z-10 bg-base-100 pl-4 pr-[6px]">
  <div
    class="flex md:px-0 items-center justify-between py-[4pt] my-[4pt] h-[36px]! min-h-[36px]!"
  >
    <button on:click={handleBack} class="cursor-pointer">
      <!-- Chevron left Icon -->
      <svg
        class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        /></svg
      >
    </button>

    <div class="flex">
      <LearnMarketMakingBtn />
      <MixinMenu />
    </div>
  </div>
</header>
<main class="mt-2 mb-20">
  <slot />
</main>
