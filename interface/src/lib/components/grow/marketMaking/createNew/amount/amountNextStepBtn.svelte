<script lang="ts">
  import { _ } from "svelte-i18n";
  import { goto } from "$app/navigation";

  const setAmountToURL = (baseAmount: string | null, quoteAmount: string | null) => {
    if (!baseAmount || !quoteAmount) return;
    const url = new URL(window.location.href);
    url.searchParams.set("base_amount", baseAmount);
    url.searchParams.set("quote_amount", quoteAmount);
    goto(url.toString());
  };

  export let baseAmount: string | null;
  export let quoteAmount: string | null;
</script>

<button
  class="btn bg-base-content text-base-100 w-32 rounded-lg no-animation !rounded-full"
  on:click={() => {
    setAmountToURL(baseAmount, quoteAmount);
  }}
>
  {$_("next_step")}
</button>
