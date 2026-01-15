<script lang="ts">
    import clsx from "clsx";
    import ExchangeIcon from "$lib/components/common/exchangeIcon.svelte";
    import ExchangeName from "$lib/components/common/exchangeName.svelte";

    export let exchangeName: string;
    export let selected: boolean = false;
    export let status: string = "Available";
    export let onClick: () => void;
</script>

<button
    class={clsx(
        "flex flex-col items-center justify-center p-4 space-y-2 rounded-[2.5rem] transition-all duration-200 w-full aspect-square bg-base-100",
        selected
            ? "border-[3px] border-base-content"
            : "border border-base-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1",
    )}
    on:click={onClick}
>
    <div class="w-12 h-12 flex items-center justify-center">
        <ExchangeIcon {exchangeName} clazz="w-12 h-12 rounded-2xl" />
    </div>

    <div class="flex flex-col items-center space-y-2">
        <ExchangeName
            {exchangeName}
            clazz="font-bold text-normal text-base-content"
        />

        <span
            class={clsx(
                "px-3 py-1 rounded-full text-xs font-semibold",
                selected
                    ? "bg-base-200 text-base-content"
                    : "text-base-content/40",
            )}
        >
            {status}
        </span>
    </div>
</button>
