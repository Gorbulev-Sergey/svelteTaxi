<script>
	// @ts-nocheck
	import ComponentAuth from '$lib/components/ComponentAuth.svelte';
	import ComponentTitle from '$lib/components/ComponentTitle.svelte';
	import ComponentOrder from '$lib/components/ComponentOrder.svelte';
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
	import Order from '$lib/models/Order';
	import { positionFrom, positionTo, showOrder } from '$lib/scripts/myData';
	import Position from '$lib/models/Position';
	import ComponentCreateOrder from '$lib/components/ComponentCreateOrder.svelte';

	let user;
	let order = new Order();
	let mapOrders, mapOrdersFiltered;

	let ordersForFilterStatus = {
		selected: 'все',
		orders: ['все', 'в работе', 'завершён']
	};

	function filter(status) {
		let mapOrdersForFilter = mapOrders;
		switch (status) {
			case 'все':
				break;
			case status:
				mapOrdersForFilter = Object.fromEntries(
					[...Object.entries(mapOrdersForFilter)].filter(([k, v]) => v.status == status)
				);
				break;
		}
		return mapOrdersForFilter;
	}

	onMount(async () => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				user = auth;
				// Очень важный код (ЗАПРОС С ФИЛЬТРАЦИЕЙ)
				onValue(
					query(child(ref(db), 'orders'), ...[orderByChild('client'), equalTo(user.uid)]),
					(snap) => {
						if (snap.exists()) {
							mapOrders = snap.val();
							mapOrdersFiltered = filter(ordersForFilterStatus.selected);
						}
					}
				);
				order.route.positionFrom = $positionFrom;
				order.route.positionTo = $positionTo;
			} else {
				goto('/client/login');
			}
		});
	});

	onMount(async () => {
		ymaps.ready(() => {
			new ymaps.SuggestView('searchFrom');
			new ymaps.SuggestView('searchTo');
		});
	});

	function createOrder() {
		if (order.route.positionFrom && order.route.positionTo && order.goods && order.car) {
			order.client = auth.currentUser?.uid;
			order.dateOfDelivery = new Date(order.dateOfDelivery).toLocaleDateString();
			push(ref(db, 'orders'), order);
			order = new Order();
		}
	}
</script>

<ComponentAuth>
	<div class="d-flex flex-column mx-0 mb-2">
		<ComponentTitle title="Мои заказы">
			<button class="btn btn-dark" data-bs-toggle="collapse" data-bs-target="#collapseForm">
				Добавить
			</button>
		</ComponentTitle>
		<div class="d-flex justify-content-start">
			<!--Первый фильтр-->
			<div class="dropdown">
				<div class="btn-group btn-group-sm">
					<button class="btn btn-dark">статус:</button>
					<button class="btn btn-sm btn-light rounded-end" data-bs-toggle="dropdown">
						<span class="me-2">{ordersForFilterStatus.selected}</span>
						<i class="fa-solid fa-angle-down" />
					</button>
					<div class="dropdown-menu">
						{#each ordersForFilterStatus.orders as item}
							<button
								class="dropdown-item"
								on:click={() => {
									ordersForFilterStatus.selected = item;
									mapOrdersFiltered = filter(ordersForFilterStatus.selected);
								}}>{item}</button
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<ComponentCreateOrder {order} />

	{#if !mapOrdersFiltered}
		<div class="d-flex justify-content-center align-items-center" style="height: 50vh;">
			<div class="spinner-border" role="status">
				<span class="visually-hidden">Загрузка...</span>
			</div>
		</div>
	{:else}
		{#each Object.entries(mapOrdersFiltered) as [key, value], i}
			<ComponentOrder order={value} {i} />
		{/each}
	{/if}
</ComponentAuth>
