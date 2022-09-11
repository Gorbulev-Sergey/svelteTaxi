<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/scripts/firebase.js';
	import { updateProfile } from 'firebase/auth';
	import { ref, child, get, set, push, remove } from 'firebase/database';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { onMount } from 'svelte';
	import Client from '$lib/Client';

	let user;
	let isRegister = false;
	let client = new Client();

	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				// После создания пользователя, добавляем в его профиль имя
				updateProfile(auth.currentUser, {
					displayName: client.value.name
				});
				goto('/');
			}
		});
	});
	function createClient() {
		if (
			client.value.name.replaceAll(' ', '').length > 0 &&
			client.value.email.includes('@') &&
			client.value.email.includes('.') &&
			client.value.password.replaceAll(' ', '').length > 3
		) {
			createUserWithEmailAndPassword(auth, client.value.email, client.value.password).then(
				(credential) => {
					user = credential.user;
					isRegister = true;
					user.displayName = client.value.name;
					// Добавляем клиента в базу данных
					client.value.password = null; // Убираем пароль
					set(ref(db, 'clients/' + user.uid), client.value);
				}
			);
		}
	}
</script>

{#if !isRegister}
	<div class="position-fixed mt-3 text-center w-100" style="left:0">
		<button class="btn btn-sm btn-light" on:click={() => goto('/driver/register')}
			>Регистрация водителей</button
		>
		<div class="d-flex justify-content-center align-items-center" style="min-height: 100vh">
			<div class="bg-light p-3 rounded text-center">
				<h4 class="mb-3">Зарегистрироваться</h4>
				<input class="form-control mb-3" bind:value={client.value.name} placeholder="ваше имя" />
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
				<button class="btn btn-dark mb-1" on:click={() => createClient()}>Зарегистрироваться</button
				>
				<br />
				<button class="btn btn-sm btn-light " on:click={() => goto('/client/login')}
					>У меня есть аккаунт</button
				>
			</div>
		</div>
	</div>
{/if}
