<script>
	import Order from '$lib/models/Order';

	export let i = 0;
	export let order = new Order();
</script>

<div class="d-flex align-items-start bg-white p-3 rounded mb-2">
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
			<i class="small text-muted">дата доставки: </i><span class="me-1">{order.dateOfDelivery}</span
			>
		</div>
		<slot name="driverName" />
		<div>
			{#if order.status == 'завершён'}
				<span class="badge bg-success">{order.status == null ? '' : order.status}</span>
			{:else}
				<span class="badge bg-dark">{order.status == null ? '' : order.status}</span>
			{/if}
		</div>
		<div>{order.route.distance}</div>
	</div>
	<slot />
</div>
