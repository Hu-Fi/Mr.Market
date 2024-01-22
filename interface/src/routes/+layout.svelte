<script lang="ts">
	import "./styles.css";
	import "../app.css";
	import { Toaster } from "svelte-french-toast";
	import { initi18n as i18n } from "../i18n/i18n";
	import { autoConnectMixin } from "$lib/stores/wallet";
	import Loading from "$lib/components/home/loading.svelte";
	import { detectSystemDark, theme } from "$lib/stores/theme";

	const init = async () => {
		await i18n();
		autoConnectMixin();
		detectSystemDark();
	};

</script>

<meta
	name="viewport"
	content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>

{#await init()}
	<Loading />
{:then}
	<div class="app text-base-content select-none" data-theme={$theme}>
		<slot />
	</div>
	<Toaster />
{/await}

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
