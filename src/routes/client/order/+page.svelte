<script>
	import { onMount } from 'svelte';
	import { auth, db } from '$lib/scripts/firebase';
	import { goto } from '$app/navigation';
	import {
		child,
		equalTo,
		onValue,
		orderByChild,
		push,
		query,
		ref,
		update
	} from 'firebase/database';
	import Order from '$lib/Order';
	import ComponentOrder from '$lib/components/ComponentOrder.svelte';
	import { MakeOrderShow, positionFrom, positionTo } from '$lib/scripts/myData';
	import ComponentAuth from '$lib/components/ComponentAuth.svelte';

	let user;
	let order = new Order();
	let mapOrders = new Map();
	$: showForm = '';

	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				user = auth;
				// Очень важный код (ЗАПРОС С ФИЛЬТРАЦИЕЙ)
				onValue(
					query(child(ref(db), 'orders'), ...[orderByChild('client'), equalTo(user.uid)]),
					(snap) => {
						if (snap.exists()) {
							mapOrders = snap.val();
						}
					}
				);
				positionFrom.subscribe((v) => (order.positionFrom = v));
				positionTo.subscribe((v) => (order.positionTo = v));
				MakeOrderShow.subscribe((v) => (showForm = v));
			} else {
				goto('/client/login');
			}
		});
	});
	function createOrder() {
		if (order.positionFrom && order.positionTo && order.goods && order.car) {
			order.client = auth.currentUser?.uid;
			order.dateOfDelivery = new Date(order.dateOfDelivery).toLocaleDateString(); //
			push(ref(db, 'orders'), order);
			order = new Order();
		}
	}
</script>

<ComponentAuth>
	<div>
		<div class="d-flex justify-content-between align-items-center m-2">
			<h3>Мои заказы</h3>
			<button class="btn btn-dark" data-bs-toggle="collapse" data-bs-target="#collapseForm">
				Добавить заказ
			</button>
		</div>

		<div class="collapse bg-white rounded p-3 mb-3 {showForm}" id="collapseForm">
			<h4 class="mb-3">Заказать автомобиль</h4>
			<div class="input-group mb-3">
				<input
					class="form-control"
					bind:value={order.positionFrom.address}
					placeholder="откуда забирать товар"
					readonly
				/>
				<button
					class="btn btn-dark"
					on:click={() => {
						MakeOrderShow.update((v) => 'show');
						goto('/client/order/mapFrom');
					}}>...</button
				>
			</div>
			<div class="input-group mb-3">
				<input
					class="form-control"
					bind:value={order.positionTo.address}
					placeholder="куда везти товар"
					readonly
				/>
				<button
					class="btn btn-dark"
					on:click={() => {
						MakeOrderShow.update((v) => 'show');
						goto('/client/order/mapTo');
					}}>...</button
				>
			</div>
			<input
				class="form-control mb-3"
				bind:value={order.goods}
				placeholder="груз, опишите в двух словах"
			/>
			<input class="form-control mb-3" bind:value={order.car} placeholder="автомобиль" />
			<input
				type="date"
				class="form-control mb-3"
				bind:value={order.dateOfDelivery}
				placeholder="когда, дата доставки"
			/>
			<button
				class="btn btn-dark mb-1"
				data-bs-toggle="collapse"
				data-bs-target="#collapseForm"
				on:click={() => {
					createOrder();
					MakeOrderShow.update((v) => '');
					order = new Order();
				}}>Сделать заказ</button
			>
			<button
				class="btn btn-dark mb-1"
				data-bs-toggle="collapse"
				data-bs-target="#collapseForm"
				on:click={() => {
					MakeOrderShow.update((v) => '');
					order = new Order();
				}}>Отмена</button
			>
		</div>
	</div>

	{#each Object.entries(mapOrders) as [key, value], i}
		<ComponentOrder order={value} {i} />
	{/each}
</ComponentAuth>
