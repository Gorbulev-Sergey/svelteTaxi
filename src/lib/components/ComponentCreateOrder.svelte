<script>
	// @ts-nocheck

	import { auth, db } from '$lib/scripts/firebase';
	import { push, ref } from 'firebase/database';
	import { goto } from '$app/navigation';
	import { showOrder, positionFrom, positionTo } from '$lib/scripts/myData';
	import Order from '$lib/models/Order';
	import Position from '$lib/models/Position';
	import { mapsGetRouteData, mapsRoute } from '$lib/scripts/mapsYandex';
	import { Route } from '$lib/models/Route';

	export let order = new Order();

	function createOrder() {
		if (order.route.positionFrom && order.route.positionTo && order.goods && order.car) {
			order.client = auth.currentUser?.uid;

			mapsGetRouteData(mapsRoute($positionFrom.address, $positionTo.address), (r) => {
				order.route.distance = r.distance;
				order.route.duration = r.duration;
				push(ref(db, 'orders'), order);
				order = new Order();
			});
		}
	}
</script>

<div class="collapse bg-white rounded p-3 mb-3 {$showOrder}" id="collapseForm">
	<h4 class="mb-3">Заказать автомобиль</h4>
	<div class="input-group mb-3">
		<input
			id="searchFrom"
			type="text"
			bind:value={$positionFrom.address}
			on:change={async function () {
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
		<button class="btn btn-outline-dark" on:click={() => ($positionFrom = new Position())}
			><i class="fa-solid fa-delete-left" /></button
		>
		<button
			class="btn btn-dark"
			on:click={() => {
				$showOrder = 'show';
				goto('/client/order/map/from');
			}}><i class="fa-solid fa-earth-americas" /></button
		>
	</div>
	<div class="input-group mb-3">
		<input
			id="searchTo"
			type="text"
			bind:value={$positionTo.address}
			on:change={async function () {
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
		<button class="btn btn-outline-dark" on:click={() => ($positionTo = new Position())}
			><i class="fa-solid fa-delete-left" /></button
		>
		<button
			class="btn btn-dark"
			on:click={() => {
				$showOrder = 'show';
				goto('/client/order/map/to');
			}}><i class="fa-solid fa-earth-americas" /></button
		>
	</div>
	<input
		class="form-control mb-3"
		bind:value={order.goods}
		placeholder="груз, опишите в двух словах"
	/>
	<input class="form-control mb-3" bind:value={order.car} placeholder="автомобиль" />
	<div class="input-group mb-3">
		<span class="input-group-text">дата доставки</span>
		<input
			type="date"
			class="form-control"
			bind:value={order.dateOfDelivery}
			placeholder="когда, дата доставки"
		/>
	</div>
	<div class="d-flex justify-content-between align-items-center">
		<button
			class="btn btn-dark mb-1"
			data-bs-toggle="collapse"
			data-bs-target="#collapseForm"
			on:click={() => {
				createOrder();
				$showOrder = '';
				$positionFrom = new Position();
				$positionTo = new Position();
			}}>Сделать заказ</button
		><button
			class="btn btn-dark mb-1"
			data-bs-toggle="collapse"
			data-bs-target="#collapseForm"
			on:click={() => {
				$showOrder = '';
				$positionFrom = new Position();
				$positionTo = new Position();
			}}>Отмена</button
		>
	</div>
</div>
