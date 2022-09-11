<script>
	// @ts-nocheck
	import { auth } from '$lib/scripts/firebase.js';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Driver from '$lib/Driver';

	let user;
	let isLogin = false;
	let driver = new Driver();

	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				goto('/');
			}
		});
	});

	function loginDriver() {
		if (
			driver.value.email.includes('@') &&
			driver.value.email.includes('.') &&
			driver.value.password.replaceAll(' ', '').length > 3
		) {
			signInWithEmailAndPassword(auth, driver.value.email, driver.value.password).then(
				(credential) => {
					user = credential.user;
					isLogin = true;
				}
			);
		}
	}
</script>

{#if !isLogin}
	<div class="position-fixed mt-3 text-center w-100" style="left:0">
		<button class="btn btn-sm btn-light" on:click={() => goto('/client/login')}
			>Вход для клиентов</button
		>
	</div>
	<div class="d-flex justify-content-center align-items-center" style="min-height: 100vh">
		<div class="bg-light p-3 rounded text-center" style="min-width: 470px;">
			<h4 class="mb-3">Вход для водителей</h4>
			<input
				class="form-control mb-3"
				bind:value={driver.value.email}
				placeholder="email"
				type="email"
			/>
			<input
				class="form-control mb-3"
				bind:value={driver.value.password}
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
{/if}
