<script>
	import { goto } from '$app/navigation';
	import Order from '$lib/models/Order';
	import { backUrl, routeDetails } from '$lib/scripts/myData';

	export let i = 0;
	export let order = new Order();
	export let backToUrl = '';
</script>

<div class=" bg-white p-3 rounded mb-2">
	<div class="d-flex align-items-start">
		<div class="badge bg-dark mt-1 me-2">{i + 1}</div>
		<div class="flex-grow-1">
			<div>
				<i class="small text-muted">откуда: </i><span class="me-1"
					>{order.route.positionFrom.address}</span
				>
			</div>
			<div><i class="small text-muted">куда: </i><span>{order.route.positionTo.address}</span></div>
			<div><i class="small text-muted">что везти: </i><span class="me-1">{order.goods}</span></div>
			<div><i class="small text-muted">автомобиль: </i><span>{order.car}</span></div>
			<div>
				<i class="small text-muted">дата доставки: </i><span class="me-1"
					>{order.dateOfDelivery}</span
				>
			</div>
			<slot name="driver" />
		</div>
		<slot />
	</div>
	<div class="d-flex justify-content-between align-items-center">
		<div class="d-flex justify-content-between align-items-center">
			<div class="badge bg-transparent mt-1 me-2 hidden">{i + 1}</div>
			<div class="mt-1 me-2">
				{#if order.status == 'завершён'}
					<span class="badge bg-success">{order.status == null ? '' : order.status}</span>
				{:else}
					<span class="badge bg-dark">{order.status == null ? '' : order.status}</span>
				{/if}
			</div>
		</div>

		<button
			class="badge bg-dark border-0"
			on:click={() => {
				$routeDetails = order.route;
				$backUrl = backToUrl;
				goto('/route');
			}}
		>
			<small>маршрут:</small>
			<div class="badge bg-secondary bg-opacity-50">
				<i class="fa-solid fa-road" />
				{order.route.distance}
			</div>
			<div class="badge bg-secondary bg-opacity-50">
				<i class="fa-solid fa-clock" /> ~{order.route.duration.replace('.', '')}
			</div>
		</button>
	</div>
</div>
