<script lang="ts">
    import { _ } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
</script>

<div
    class="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 flex gap-4 pb-8 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
>
    <button
        class="flex-1 btn bg-white hover:bg-gray-50 text-base-content border border-gray-200 rounded-full h-12 min-h-12 text-sm font-bold normal-case shadow-sm"
        on:click={() => dispatch("cancel")}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.5"
            stroke="currentColor"
            class="w-4 h-4 mr-2"
            ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
            /></svg
        >
        {$_("cancel_order")}
    </button>
    <button
        class="flex-1 btn bg-black hover:bg-gray-900 text-white border-none rounded-full h-12 min-h-12 text-sm font-bold normal-case shadow-lg"
        on:click={() => dispatch("modify")}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-4 h-4 mr-2"
        >
            <path
                d="M21.731 2.269a2.625 2.625 0 113.712 3.712l-1.157 1.157-3.712-3.712 1.157-1.157zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"
            />
        </svg>
        {$_("modify_order")}
    </button>
</div>
