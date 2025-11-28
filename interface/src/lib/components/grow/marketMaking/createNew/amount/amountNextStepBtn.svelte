<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let baseAmount = "";
  export let quoteAmount = "";
  export let mode: "both_token" | "single_token" = "both_token";
  export let tokenType: "base" | "quote" = "base";

  const sanitizeAmount = (value?: string | null) => value?.trim() ?? "";

  const isAmountValid = (value?: string | null) => {
    const sanitized = sanitizeAmount(value);
    if (!sanitized) return false;
    const numericValue = Number(sanitized);
    return Number.isFinite(numericValue) && numericValue > 0;
  };

  $: isDisabled =
    mode === "both_token"
      ? !(isAmountValid(baseAmount) && isAmountValid(quoteAmount))
      : mode === "single_token" && tokenType === "base"
        ? !isAmountValid(baseAmount)
        : !isAmountValid(quoteAmount);

  const setAmountToURL = () => {
    if (isDisabled) return;
    const sanitizedBaseAmount = sanitizeAmount(baseAmount);
    const sanitizedQuoteAmount = sanitizeAmount(quoteAmount);
    const newUrl = new URL($page.url);

    if (mode === "both_token") {
      newUrl.searchParams.set("base_amount", sanitizedBaseAmount);
      newUrl.searchParams.set("quote_amount", sanitizedQuoteAmount);
    } else if (mode === "single_token") {
      if (tokenType === "base") {
        newUrl.searchParams.set("base_amount", sanitizedBaseAmount);
        newUrl.searchParams.delete("quote_amount");
      } else {
        newUrl.searchParams.delete("base_amount");
        newUrl.searchParams.set("quote_amount", sanitizedQuoteAmount);
      }
    }

    const newPath = newUrl.pathname + newUrl.search;
    goto(newPath, {
      replaceState: true,
      keepFocus: true,
      noScroll: true,
    });
  };
</script>

<button
  class="btn bg-base-content text-base-100 w-32 no-animation rounded-full!"
  class:btn-disabled={isDisabled}
  class:opacity-50={isDisabled}
  class:cursor-not-allowed={isDisabled}
  disabled={isDisabled}
  aria-disabled={isDisabled}
  on:click={setAmountToURL}
>
  {$_("next_step")}
</button>
