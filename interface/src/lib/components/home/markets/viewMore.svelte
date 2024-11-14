<script lang="ts">
    import { _ } from "svelte-i18n";
    import { goto } from "$app/navigation";
</script>

<div class="flex justify-center w-full p-4">
    <button
        class="btn btn-outline border-base-300 w-full rounded-full no-animation hover:bg-base-100 hover:border-base-300 focus:bg-base-100"
        on:click={() => goto("/market")}
    >
        <span class="mx-3 text-sm text-base-content/80">{$_("view_more")}</span>
    </button>
</div>
