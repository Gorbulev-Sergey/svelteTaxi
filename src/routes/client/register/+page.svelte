<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/scripts/firebase.js';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		updateProfile
	} from 'firebase/auth';
	import { ref, child, get, set, push, remove, onValue } from 'firebase/database';
	import Client from '$lib/Client';

	let client = new Client();

	function createClient() {
		if (
			client.name.replaceAll(' ', '').length > 0 &&
			client.email.includes('@') &&
			client.email.includes('.') &&
			client.password.replaceAll(' ', '').length > 3
		) {
			createUserWithEmailAndPassword(auth, client.email, client.password)
				.then((credential) => {
					// Если новый пользователь успешно создался в auth, то
					// Добавляем клиента в базу данных
					client.password = null; // Убираем пароль
					set(ref(db, 'clients/' + credential.user.uid), client);
					// После создания пользователя, добавляем в его профиль имя
					updateProfile(auth.currentUser, {
						displayName: client.name
					});
				})
				.catch((error) => {
					if ((error.code = 'auth/email-already-in-use')) {
						// Если такой пользователь в auth уже есть, то входим
						signInWithEmailAndPassword(auth, client.email, client.password).then((credential) => {
							onValue(child(ref(db), `clients/${credential.user.uid}`), (snap) => {
								if (!snap.exists()) {
									// Если нет такого клиента
									// Добавляем клиента в базу данных
									client.password = null; // Убираем пароль
									set(ref(db, 'clients/' + credential.user.uid), client);
								}
							});
						});
					}
				})
				.finally(() => goto('/'));
		}
	}
</script>

<div class="position-fixed my-3 text-center w-100" style="left:0">
	<div class="d-flex justify-content-center align-items-center" style="min-height: 100vh">
		<div class="bg-light p-3 rounded text-center">
			<h4 class="mb-3">Зарегистрироваться</h4>
			<input class="form-control mb-3" bind:value={client.name} placeholder="ваше имя" />
			<input class="form-control mb-3" bind:value={client.email} placeholder="email" type="email" />
			<input
				class="form-control mb-3"
				bind:value={client.password}
				placeholder="пароль"
				type="password"
			/>
			<button class="btn btn-dark mb-1" on:click={() => createClient()}>Зарегистрироваться</button>
			<br />
			<button class="btn btn-sm btn-light " on:click={() => goto('/client/login')}
				>У меня есть аккаунт</button
			>
		</div>
	</div>
</div>
