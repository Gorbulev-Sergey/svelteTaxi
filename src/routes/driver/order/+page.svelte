<script>
	import { onMount } from 'svelte';
	import { auth, db } from '$lib/scripts/firebase';
	import { goto } from '$app/navigation';
	import {
		child,
		equalTo,
		onValue,
		orderByChild,
		set,
		push,
		query,
		ref,
		update
	} from 'firebase/database';
	import Order from '$lib/Order';
	import ComponentOrder from '$lib/components/ComponentOrder.svelte';
	import { positionFrom, positionTo } from '$lib/scripts/myData';
	import { updateCurrentUser } from 'firebase/auth';
	import { get_all_dirty_from_scope } from 'svelte/internal';

	let isLogin = false;
	let user;
	let order = new Order();
	let mapOrders = new Map();
	$: showForm = '';

	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				user = auth;
				isLogin = true;
				// Очень важный код (ЗАПРОС С ФИЛЬТРАЦИЕЙ)
				onValue(query(child(ref(db), 'orders')), (s) => {
					mapOrders = s.val();
				});
				positionFrom.subscribe((v) => (order.positionFrom = v));
				positionTo.subscribe((v) => (order.positionTo = v));
			} else {
				goto('/client/login');
			}
		});
	});
</script>

{#if isLogin}
	<div class="d-flex justify-content-between align-items-center m-3">
		<h3>Все заказы</h3>
	</div>

	{#each Object.entries(mapOrders) as [key, value], i}
		<ComponentOrder order={value} {i}>
			<div class="d-flex flex-column">
				{#if !value.status}
					<button
						class="btn btn-sm btn-dark mb-1"
						on:click={() => {
							set(ref(db, `orders/${key}/driver`), {
								name: auth.currentUser?.displayName,
								uid: auth.currentUser?.uid
							});
							set(ref(db, `orders/${key}/status`), 'в работе');
						}}>Взять заказ</button
					>
				{/if}
				{#if value.status == 'в работе' && new Date(value.dateOfDelivery).getTime() >= new Date().getTime()}
					<button
						class="btn btn-sm btn-success"
						on:click={() => {
							set(ref(db, `orders/${key}/status`), 'завершён');
						}}>Завершить заказ</button
					>
				{/if}
			</div>
		</ComponentOrder>
	{/each}
{/if}
