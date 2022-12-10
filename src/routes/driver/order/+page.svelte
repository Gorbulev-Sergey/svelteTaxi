<script>
	// @ts-nocheck

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
	import Order from '$lib/models/Order';
	import ComponentOrder from '$lib/components/ComponentOrder.svelte';
	import { backUrl, positionFrom, positionTo } from '$lib/scripts/myData';
	import { updateCurrentUser } from 'firebase/auth';
	import ComponentAuth from '$lib/components/ComponentAuth.svelte';
	import ComponentTitle from '$lib/components/ComponentTitle.svelte';
	import { noop } from 'svelte/internal';

	let user;
	let order = new Order();
	let mapOrders = new Map();
	let mapOrdersFiltered = new Map();

	let ordersForFilterWho = {
		selected: 'все',
		orders: ['все', 'мои']
	};
	let ordersForFilterStatus = {
		selected: 'новый',
		orders: ['все', 'новый', 'в работе', 'завершён']
	};

	function filter(who, status) {
		let mapOrdersForFilter = new Map();
		switch (who) {
			case 'все':
				mapOrdersForFilter = mapOrders;
				break;
			case 'мои':
				mapOrdersForFilter = Object.fromEntries(
					[...Object.entries(mapOrders)].filter(([k, v]) => v.driver?.uid == auth.currentUser?.uid)
				);
				break;
		}
		switch (status) {
			case 'все':
				break;
			case 'новый':
				mapOrdersForFilter = Object.fromEntries(
					[...Object.entries(mapOrdersForFilter)].filter(([k, v]) => v.status == null)
				);
				break;
			case status:
				mapOrdersForFilter = Object.fromEntries(
					[...Object.entries(mapOrdersForFilter)].filter(([k, v]) => v.status == status)
				);
				break;
		}
		return mapOrdersForFilter;
	}

	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				user = auth;
				// Очень важный код (ЗАПРОС С ФИЛЬТРАЦИЕЙ)
				onValue(ref(db, 'orders'), (s) => {
					if (s.exists()) {
						mapOrders = s.val();
						mapOrdersFiltered = filter(ordersForFilterWho.selected, ordersForFilterStatus.selected);
					}
				});
				positionFrom.subscribe((v) => (order.route.positionFrom = v));
				positionTo.subscribe((v) => (order.route.positionTo = v));
			} else {
				goto('/driver/login');
			}
		});
	});
</script>

<ComponentAuth>
	<div class="d-flex flex-column mx-0 mb-2">
		<ComponentTitle title="Заказы" />
		<div class="d-flex justify-content-start">
			<!--Первый фильтр-->
			<div class="dropdown me-1">
				<div class="btn-group btn-group-sm">
					<button class="btn btn-dark">тип:</button>
					<button class="btn btn-sm btn-light rounded-end" data-bs-toggle="dropdown">
						<span class="me-2">{ordersForFilterWho.selected}</span>
						<i class="fa-solid fa-angle-down" />
					</button>
					<div class="dropdown-menu">
						{#each ordersForFilterWho.orders as item}
							<button
								class="dropdown-item"
								on:click={() => {
									ordersForFilterWho.selected = item;
									// switch (item) {
									// 	case 'все':
									// 		mapOrdersFiltered = mapOrders;
									// 		break;
									// 	case 'мои':
									// 		mapOrdersFiltered = Object.fromEntries(
									// 			[...Object.entries(mapOrdersFiltered)].filter(
									// 				([k, v]) => v.driver?.uid == auth.currentUser?.uid
									// 			)
									// 		);
									// 		break;
									// }
									mapOrdersFiltered = filter(
										ordersForFilterWho.selected,
										ordersForFilterStatus.selected
									);
								}}>{item}</button
							>
						{/each}
					</div>
				</div>
			</div>
			<!--Второй фильтр-->
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
									mapOrdersFiltered = filter(
										ordersForFilterWho.selected,
										ordersForFilterStatus.selected
									);
								}}>{item}</button
							>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	{#each Object.entries(mapOrdersFiltered).sort(([k1, v1], [k2, v2]) => new Date(v2.dateOrderCreated) - new Date(v1.dateOrderCreated)) as [key, value], i}
		<ComponentOrder order={value} {i} backToUrl="/driver/order">
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
				{#if value.status == 'в работе' && new Date(value.dateOfDelivery) <= new Date(Date.now())}
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
</ComponentAuth>
