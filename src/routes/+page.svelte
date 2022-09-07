<script>
	// @ts-nocheck
	import { auth, db } from '$lib/firebase.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let isLogin = false;
	let user;

	onMount(() => {
		goto('/order');
		// auth.onAuthStateChanged((auth) => {
		// 	if (auth) {
		// 		user = auth;
		// 		isLogin = true;
		// 	} else {
		// 		goto('/client/login');
		// 	}
		// });
	});
</script>
