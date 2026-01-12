<script lang="ts">
    import { _ } from "svelte-i18n";
    export let onBack = () => {};
    export let onConfirm = () => {};
    export let confirmDisabled = true;
</script>

<div
    class="fixed bottom-10 left-0 right-0 flex justify-center gap-4 z-20 pointer-events-none px-6"
>
    <button
        class="btn btn-xl flex-0 pointer-events-auto bg-base-200 text-base-content px-6 py-4 rounded-full text-lg font-bold shadow-xl border-none hover:bg-base-300 transition-colors"
        on:click={onBack}>{$_("back")}</button
    >
    <button
        class="btn btn-xl flex-1 pointer-events-auto bg-base-content text-base-100 px-6 py-4 rounded-full text-lg font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-content/80 transition-colors"
        on:click={onConfirm}
        disabled={confirmDisabled}
    >
        {$_("confirm_selection")}
    </button>
</div>
