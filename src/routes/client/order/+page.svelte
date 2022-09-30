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
	import { MakeOrderShow, positionFrom, positionTo } from '$lib/scripts/myData';
	import Position from '$lib/models/Position';

	let user;
	let order = new Order();
	let mapOrders = new Map();
	let mapOrdersFiltered = new Map();
	let showForm = '';

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
				// positionFrom.subscribe((v) => (order.route.positionFrom = v));
				// positionTo.subscribe((v) => (order.route.positionTo = v));
				MakeOrderShow.subscribe((v) => (showForm = v));
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
	<div class="d-flex flex-column mx-2 mb-2">
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

	<div class="collapse bg-white rounded p-3 mb-3 {showForm}" id="collapseForm">
		<h4 class="mb-3">Заказать автомобиль</h4>
		<div class="input-group mb-3">
			<input
				id="searchFrom"
				type="text"
				bind:value={$positionFrom.address}
				on:blur={async function () {
					setTimeout(() => {
						$positionFrom.address = this.value;
						ymaps.geocode(this.value).then((res) => {
							let geoObject = res.geoObjects.get(0);
							$positionFrom.coordinates = geoObject.geometry.getCoordinates();
						});
					}, 1000);
				}}
				class="form-control rounded-start"
				placeholder="откуда забирать товар"
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
				id="searchTo"
				type="text"
				bind:value={order.route.positionTo.address}
				on:blur={async function () {
					setTimeout(() => {
						$positionTo.address = this.value;
						ymaps.geocode(this.value).then((res) => {
							let geoObject = res.geoObjects.get(0);
							$positionTo.coordinates = geoObject.geometry.getCoordinates();
						});
					}, 1000);
				}}
				class="form-control rounded-start"
				placeholder="куда везти товар"
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
		<div class="d-flex justify-content-between align-items-center">
			<button
				class="btn btn-dark mb-1"
				data-bs-toggle="collapse"
				data-bs-target="#collapseForm"
				on:click={() => {
					createOrder();
					MakeOrderShow.update((v) => '');
					$positionFrom = new Position();
					$positionTo = new Position();
				}}>Сделать заказ</button
			><button
				class="btn btn-dark mb-1"
				data-bs-toggle="collapse"
				data-bs-target="#collapseForm"
				on:click={() => {
					MakeOrderShow.update((v) => '');
					$positionFrom = new Position();
					$positionTo = new Position();
				}}>Отмена</button
			>
		</div>
	</div>

	{#each Object.entries(mapOrdersFiltered) as [key, value], i}
		<ComponentOrder order={value} {i} />
	{/each}
</ComponentAuth>
