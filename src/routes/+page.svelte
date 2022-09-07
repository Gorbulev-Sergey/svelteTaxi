<script>
	// @ts-nocheck
	import { auth, db } from '$lib/firebase.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let user;

	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				user = auth;
			} else {
				goto('/client/login');
			}
		});
	});
</script>

{#if user}
	<h1>Привет {user?.displayName}</h1>
	<button
		class="btn btn-dark"
		on:click={() => {
			auth.signOut();
		}}>Выйти</button
	>
{/if}
