<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/scripts/firebase.js';
	import { updateProfile } from 'firebase/auth';
	import { ref, child, get, set, push, remove } from 'firebase/database';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { onMount } from 'svelte';
	import Driver from '$lib/Driver';

	let user;
	let driver = new Driver();

	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				// После создания пользователя, добавляем в его профиль имя
				updateProfile(auth.currentUser, {
					displayName: driver.value.name
				});
				goto('/driver/order');
			}
		});
	});
	function createDriver() {
		if (
			driver.value.name.replaceAll(' ', '').length > 0 &&
			driver.value.email.includes('@') &&
			driver.value.email.includes('.') &&
			driver.value.password.replaceAll(' ', '').length > 3
		) {
			createUserWithEmailAndPassword(auth, driver.value.email, driver.value.password)
				.then((credential) => {
					user = credential.user;
					user.displayName = driver.value.name;
					// Добавляем клиента в базу данных
					driver.value.password = null; // Убираем пароль
					set(ref(db, 'drivers/' + user.uid), driver.value);
				})
				.catch((error) => {
					if ((error.code = 'auth/email-already-in-use')) {
						console.log('Такой пользователь уже есть');
					}
				})
				.finally();
		}
	}
</script>

<div class="position-fixed mt-3 text-center w-100" style="left:0">
	<div class="d-flex justify-content-center align-items-center" style="min-height: 100vh">
		<div class="bg-light p-3 rounded text-center">
			<h4 class="mb-3">Регистрация водителей</h4>
			<input class="form-control mb-3" bind:value={driver.value.name} placeholder="ваше имя" />
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
			<button class="btn btn-dark mb-1" on:click={() => createDriver()}>Зарегистрироваться</button>
			<br />
			<button class="btn btn-sm btn-light " on:click={() => goto('/driver/login')}
				>У меня есть аккаунт</button
			>
		</div>
	</div>
</div>
