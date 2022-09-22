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
	let mapOrdersFiltered = new Map();
	$: showForm = '';

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
							mapOrdersFiltered = filter(ordersForFilterStatus.selected);
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
	<div class="d-flex flex-column mx-3 mb-3">
		<div class="d-flex justify-content-between align-items-center mb-2">
			<div class="d-flex align-items-center">
				<button
					class="btn btn-outline-dark me-2"
					data-bs-toggle="offcanvas"
					data-bs-target="#offcanvasExample"><i class="fa-solid fa-bars" /></button
				>
				<h3 class="m-0 p-0">Мои заказы</h3>
			</div>
			<button class="btn btn-dark" data-bs-toggle="collapse" data-bs-target="#collapseForm">
				Добавить
			</button>
		</div>
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

	{#each Object.entries(mapOrdersFiltered) as [key, value], i}
		<ComponentOrder order={value} {i} />
	{/each}
</ComponentAuth>
