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
	import ComponentAuth from '$lib/components/ComponentAuth.svelte';

	let user;
	let order = new Order();
	let mapOrders = new Map();
	let mapOrdersFiltered = new Map();
	$: showForm = '';

	let ordersForFilterWho = {
		selected: 'все',
		orders: ['все', 'мои']
	};
	let ordersForFilterStatus = {
		selected: '',
		orders: ['', 'в работе', 'завершён']
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
			case '':
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
				onValue(query(child(ref(db), 'orders')), (s) => {
					if (s.exists()) {
						mapOrders = s.val();
						mapOrdersFiltered = filter(ordersForFilterWho.selected, ordersForFilterStatus.selected);
					}
				});
				positionFrom.subscribe((v) => (order.positionFrom = v));
				positionTo.subscribe((v) => (order.positionTo = v));
			} else {
				goto('/driver/login');
			}
		});
	});
</script>

<ComponentAuth>
	<div class="d-flex justify-content-between align-items-center mx-3 mt-2 mb-3">
		<h3 class="p-0 m-0">Заказы</h3>
		<div class="d-flex align-items-center">
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
									// switch (item) {
									// 	case '':
									// 		mapOrdersFiltered = mapOrders;
									// 		break;
									// 	case item:
									// 		mapOrdersFiltered = Object.fromEntries(
									// 			[...Object.entries(mapOrders)].filter(([k, v]) => v.status == item)
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
		</div>
	</div>

	{#each Object.entries(mapOrdersFiltered) as [key, value], i}
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
</ComponentAuth>
