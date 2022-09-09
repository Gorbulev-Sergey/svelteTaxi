<script>
	import { onMount } from 'svelte';
	import { auth, db } from '$lib/firebase';
	import { goto } from '$app/navigation';
	import { push, ref } from 'firebase/database';
	import Order from '$lib/Order';

	let isLogin = false;
	let user;
	let order = new Order();
	onMount(() => {
		auth.onAuthStateChanged((auth) => {
			if (auth) {
				user = auth;
				isLogin = true;
			} else {
				goto('/client/login');
			}
		});
	});
	function createOrder() {
		order.dateOfDelivery = new Date(order.dateOfDelivery).toLocaleDateString(); //
		push(ref(db, 'orders'), order);
		order = new Order();
	}
</script>

{#if isLogin}
	<div class="bg-light rounded p-3">
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
		<button class="btn btn-dark mb-1" on:click={() => createOrder()}>Сделать заказ</button>
		<button class="btn btn-dark mb-1" on:click={() => (order = new Order())}>Отмена</button>
	</div>
{/if}
