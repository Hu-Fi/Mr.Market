<script lang="ts">
    import { _ } from "svelte-i18n";
    export let value = "";
    export let placeholder = $_("search_pairs_placeholder_simple");
</script>

<div class="w-full px-6 mb-4">
    <label
        class="input input-lg text-sm w-full rounded-full bg-base-200 border-0.5 border-base-200 focus-within:border-base-200 focus-within:outline-none flex items-center gap-2"
    >
        <svg
            class="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
        >
            <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2.5"
                fill="none"
                stroke="currentColor"
            >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </g>
        </svg>
        <input type="search" class="grow" {placeholder} bind:value />
    </label>
</div>
