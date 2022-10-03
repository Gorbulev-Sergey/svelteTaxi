<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ComponentAuth from '$lib/components/ComponentAuth.svelte';
	import { mapsRoute, mapsYandex } from '$lib/scripts/mapsYandex';
	import { backUrl, routeDetails } from '$lib/scripts/myData';
	import { onMount } from 'svelte';

	onMount(async () => {
		mapsYandex().then((maps) => {
			let route = mapsRoute($routeDetails.positionFrom.address, $routeDetails.positionTo.address);
			maps.geoObjects.add(route);
		});
	});
</script>

<ComponentAuth>
	<div class="container mt-3 mb-5">
		<h4 class="my-3">Детали маршрута</h4>
		<div class="rounded">
			<div id="map" class="rounded" style="width: 100%; height:80vh" />
		</div>
		<div class="d-flex justify-content-between align-items-center">
			<button class="btn btn-dark mt-3 me-1" on:click={() => {}}>Открыть в навигаторе</button>
			<button
				class="btn btn-dark mt-3"
				on:click={() => {
					goto($backUrl);
				}}>Назад</button
			>
		</div>
	</div>
</ComponentAuth>
