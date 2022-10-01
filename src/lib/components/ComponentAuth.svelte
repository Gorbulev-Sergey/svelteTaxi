<script>
	import { auth } from '$lib/scripts/firebase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isLogin = false;
	export let uriToRedirect = '/client/login';

	onMount(async () => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				isLogin = true;
			} else {
				goto(uriToRedirect);
			}
		});
	});
</script>

{#if isLogin}
	<slot />
{/if}
