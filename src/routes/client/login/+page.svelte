<script>
	// @ts-nocheck
	import { auth } from '$lib/scripts/firebase.js';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { ref, child, get, set, push, remove } from 'firebase/database';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Client from '$lib/Client';

	let user;
	let isLogin = false;
	let client = new Client();

	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				goto('/');
			}
		});
	});

	function loginClient() {
		if (
			client.value.email.includes('@') &&
			client.value.email.includes('.') &&
			client.value.password.replaceAll(' ', '').length > 3
		) {
			signInWithEmailAndPassword(auth, client.value.email, client.value.password).then(
				(credential) => {
					user = credential.user;
					isLogin = true;
				}
			);
		}
	}
</script>

{#if !isLogin}
	<div class="d-flex justify-content-center align-items-center" style="min-height: 100vh">
		<div class="bg-light p-3 rounded text-center">
			<h4 class="mb-3">Добро пожаловать</h4>
			<input
				class="form-control mb-3"
				bind:value={client.value.email}
				placeholder="email"
				type="email"
			/>
			<input
				class="form-control mb-3"
				bind:value={client.value.password}
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
{/if}
