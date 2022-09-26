<script>
	import { auth } from '$lib/scripts/firebase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isLogin = false;

	onMount(async () => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				isLogin = true;
			} else {
				goto('/client/login');
			}
		});
	});
</script>

{#if isLogin}
	<slot />
{/if}
