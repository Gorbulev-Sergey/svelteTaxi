<script>
	import { onMount } from 'svelte';
	import { auth, db } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import { onValue, push, query, ref } from 'firebase/database';
	import Order from '$lib/Order';
	import { toggle_class } from 'svelte/internal';
	import { positionFrom, positionTo } from '$lib/components/MyData';

	let isLogin = false;
	let user;
	let order = new Order();
	let mapOrders = new Map();
	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				user = auth;
				isLogin = true;
				onValue(ref(db, 'orders'), (snapshot) => {
					mapOrders = snapshot.val();
					console.log(mapOrders);
				});
				positionFrom.subscribe((v) => (order.positionFrom = v));
				positionTo.subscribe((v) => (order.positionTo = v));
			} else {
				goto('/client/login');
			}
		});
	});
	function createOrder() {
		if (order.positionFrom && order.positionTo && order.goods && order.car) {
			order.dateOfDelivery = new Date(order.dateOfDelivery).toLocaleDateString(); //
			push(ref(db, 'orders'), order);
			order = new Order();
		}
	}
</script>

{#if isLogin}
	<div>
		<div class="d-flex justify-content-between align-items-center m-3">
			<h3>Мои заказы</h3>
			<button class="btn btn-dark" data-bs-toggle="collapse" data-bs-target="#collapseForm">
				Добавить заказ
			</button>
		</div>

		<div class="collapse bg-white rounded p-3 mb-3" id="collapseForm">
			<h4 class="mb-3">Заказать автомобиль</h4>
			<div class="input-group mb-3">
				<input
					class="form-control"
					bind:value={order.positionFrom.address}
					placeholder="откуда забирать товар"
				/>
				<button class="btn btn-dark" on:click={() => goto('/order/mapFrom')}>...</button>
			</div>
			<div class="input-group mb-3">
				<input
					class="form-control"
					bind:value={order.positionTo.address}
					placeholder="куда везти товар"
				/>
				<button class="btn btn-dark" on:click={() => goto('/order/mapTo')}>...</button>
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
					order = new Order();
				}}>Сделать заказ</button
			>
			<button
				class="btn btn-dark mb-1"
				data-bs-toggle="collapse"
				data-bs-target="#collapseForm"
				on:click={() => (order = new Order())}>Отмена</button
			>
		</div>
	</div>

	{#each Object.entries(mapOrders) as [key, value], i}
		<div class="d-flex align-items-start bg-white p-3 rounded mb-2">
			<div class="badge bg-dark mt-1 me-2">{i + 1}</div>
			<div>
				<div>
					<i>откуда: </i><span class="me-1">{value.positionFrom.address},</span>
					<i>куда: </i><span>{value.positionTo.address}</span>
				</div>
				<div>
					<i>что везти: </i><span class="me-1">{value.goods},</span>
					<i>автомобиль: </i><span>{value.car}</span>
				</div>
				<div>
					<i>дата доставки: </i><span class="me-1">{value.dateOfDelivery}</span>
					<span>{value.driver == null ? '' : value.driver}</span>
				</div>
			</div>
		</div>
	{/each}
{/if}
