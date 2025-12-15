<script lang="ts">
	import "./styles.css";
	import "../app.css";
	import { Toaster } from "svelte-french-toast";
	import { initi18n as i18n } from "../i18n/i18n";
	import { autoConnectMixin, checkMixinTokenExist } from "$lib/stores/wallet";
	import { botId } from "$lib/stores/home";
	import Loading from "$lib/components/home/loading.svelte";
	import { theme } from "$lib/stores/theme";

	export let data;

	$: if (data?.basicInfo) {
		data.basicInfo.then((info: any) => {
			if (info?.mixin_app_id) {
				botId.set(info.mixin_app_id);
			}
		});
	}

	const init = async () => {
		await i18n();
		// detectSystemDark();
		if (checkMixinTokenExist()) {
			await autoConnectMixin();
		}
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
{/await}
<Toaster />

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
