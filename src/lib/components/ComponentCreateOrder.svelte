<script>
	// @ts-nocheck

	import { auth, db } from '$lib/scripts/firebase';
	import { push, ref } from 'firebase/database';
	import { goto } from '$app/navigation';
	import { showOrder, positionFrom, positionTo } from '$lib/scripts/myData';
	import Order from '$lib/models/Order';
	import Position from '$lib/models/Position';

	export let order = new Order();

	function createOrder() {
		if (order.route.positionFrom && order.route.positionTo && order.goods && order.car) {
			order.client = auth.currentUser?.uid;
			order.dateOfDelivery = new Date(order.dateOfDelivery).toLocaleDateString();
			push(ref(db, 'orders'), order);
			order = new Order();
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
				$showOrder = 'show';
				goto('/client/order/map/from');
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
				$showOrder = 'show';
				goto('/client/order/map/to');
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
