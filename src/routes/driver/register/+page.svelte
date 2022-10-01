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
	import Driver from '$lib/models/Driver';

	let driver = new Driver();

	function createDriver() {
		if (
			driver.name.replaceAll(' ', '').length > 0 &&
			driver.email.includes('@') &&
			driver.email.includes('.') &&
			driver.password.replaceAll(' ', '').length > 3
		) {
			createUserWithEmailAndPassword(auth, driver.email, driver.password)
				.then((credential) => {
					// Если новый пользователь успешно создался в auth, то
					// Добавляем водителя в базу данных
					driver.password = null; // Убираем пароль
					set(ref(db, 'drivers/' + credential.user.uid), driver);
					// После создания пользователя, добавляем в его профиль имя
					updateProfile(auth.currentUser, {
						displayName: driver.name
					});
					goto('/driver/order');
				})
				.catch((error) => {
					if ((error.code = 'auth/email-already-in-use')) {
						// Если такой пользователь в auth уже есть, то входим
						signInWithEmailAndPassword(auth, driver.email, driver.password).then((credential) => {
							onValue(child(ref(db), `drivers/${credential.user.uid}`), (snap) => {
								if (!snap.exists()) {
									// Если нет такого водителя
									// Добавляем водителя в базу данных
									driver.password = null; // Убираем пароль
									set(ref(db, 'drivers/' + credential.user.uid), driver);
									goto('/driver/order');
								}
							});
						});
					}
				});
		}
	}
</script>

<div class="position-fixed my-3 text-center w-100" style="left:0">
	<div class="d-flex justify-content-center align-items-center" style="min-height: 100vh">
		<div class="bg-light p-3 rounded text-center">
			<h4 class="mb-3">Регистрация водителей</h4>
			<input class="form-control mb-3" bind:value={driver.name} placeholder="ваше имя" />
			<input class="form-control mb-3" bind:value={driver.email} placeholder="email" type="email" />
			<input
				class="form-control mb-3"
				bind:value={driver.password}
				placeholder="пароль"
				type="password"
				on:keydown={(e) => {
					if (e.key == 'Enter') createDriver();
				}}
			/>
			<button class="btn btn-dark mb-1" on:click={() => createDriver()}>Зарегистрироваться</button>
			<br />
			<button class="btn btn-sm btn-light " on:click={() => goto('/driver/login')}
				>У меня есть аккаунт</button
			>
		</div>
	</div>
</div>
