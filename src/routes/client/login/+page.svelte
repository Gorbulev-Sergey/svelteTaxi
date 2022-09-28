<script>
	// @ts-nocheck
	import { auth } from '$lib/scripts/firebase.js';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Client from '$lib/models/Client';

	let user;
	let client = new Client();

	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				goto('/client/order');
			}
		});
	});

	function loginClient() {
		if (
			client.email.includes('@') &&
			client.email.includes('.') &&
			client.password.replaceAll(' ', '').length > 3
		) {
			signInWithEmailAndPassword(auth, client.email, client.password).then((credential) => {
				user = credential.user;
			});
		}
	}
</script>

<div class="d-flex justify-content-center align-items-center" style="min-height: 100vh">
	<div class="bg-light p-3 rounded text-center">
		<h4 class="mb-3">Добро пожаловать</h4>
		<input class="form-control mb-3" bind:value={client.email} placeholder="email" type="email" />
		<input
			class="form-control mb-3"
			bind:value={client.password}
			placeholder="пароль"
			type="password"
		/>

		<button class="btn btn-dark mb-1" on:click={() => loginClient()}>Войти</button>
		<br />
		<button class="btn btn-sm btn-light" on:click={() => goto('/client/register')}
			>У меня ещё нет аккаунта</button
		>
	</div>
</div>
