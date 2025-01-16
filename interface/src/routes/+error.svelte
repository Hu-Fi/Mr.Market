<script>
	import { _ } from 'svelte-i18n';
	import { page } from '$app/stores';
    import { goto } from '$app/navigation';
</script>

<div class="flex flex-col space-y-4 items-center justify-center h-screen">
	<span class="text-xl font-bold">
		{$page.status}
		{$page.error?.message}
	</span>
	<button 
		class="bg-base-200 text-base-content px-4 py-2 rounded-2xl"
		on:click={() => {
			goto('/');
		}}
	>
		<span>
			{$_('home')}
		</span>
	</button>
</div>
