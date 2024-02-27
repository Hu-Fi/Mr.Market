<script lang="ts">
  // import clsx from "clsx"
  // import { _ } from "svelte-i18n"
  import EmptyToken from "$lib/images/empty-token.svg"
</script>

<button class="flex flex-col items-center space-y-4">
  <div class="avatar h-16 w-16">
    <img src={EmptyToken} alt="-" />
  </div>
  <button class="btn btn-sm no-animation text-center font-semibold">
    <span> {'BTC'} </span>
  </button>
</button>