<script>
	// @ts-nocheck
	import { auth } from '$lib/scripts/firebase.js';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Driver from '$lib/Driver';

	let user;
	let driver = new Driver();

	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				goto('/driver/order');
			}
		});
	});

	function loginDriver() {
		if (
			driver.email.includes('@') &&
			driver.email.includes('.') &&
			driver.password.replaceAll(' ', '').length > 3
		) {
			signInWithEmailAndPassword(auth, driver.email, driver.password).then((credential) => {
				user = credential.user;
			});
		}
	}
</script>

<div class="d-flex justify-content-center align-items-center" style="min-height: 100vh">
	<div class="bg-light p-3 rounded text-center">
		<h4 class="mb-3">Вход для водителей</h4>
		<input class="form-control mb-3" bind:value={driver.email} placeholder="email" type="email" />
		<input
			class="form-control mb-3"
			bind:value={driver.password}
			placeholder="пароль"
			type="password"
		/>

		<button class="btn btn-dark mb-1" on:click={() => loginDriver()}>Войти</button>
		<br />
		<button class="btn btn-sm btn-light" on:click={() => goto('/driver/register')}
			>У меня ещё нет аккаунта</button
		>
	</div>
</div>
