<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { positionFrom, positionTo } from '$lib/scripts/myData';
	import {
		mapsCreatePlacemark,
		mapsGetAddress,
		mapsOnClick,
		mapsYandex
	} from '$lib/scripts/mapsYandex';
	import ComponentAuth from '$lib/components/ComponentAuth.svelte';

	let myPlacemark, geolocation;

	onMount(async () => {
		mapsYandex().then((maps) => {
			switch ($page.params.direction) {
				case 'from':
					myPlacemark = mapsCreatePlacemark($positionFrom.coordinates);
					maps.geoObjects.add(myPlacemark);
					mapsOnClick(maps, myPlacemark).then((v) => {
						$positionFrom.coordinates = v;
						mapsGetAddress(v, myPlacemark).then((r) => ($positionFrom.address = r.address));
					});
					break;
				case 'to':
					myPlacemark = mapsCreatePlacemark($positionTo.coordinates);
					maps.geoObjects.add(myPlacemark);
					mapsOnClick(maps, myPlacemark).then((v) => {
						$positionTo.coordinates = v;
						mapsGetAddress(v, myPlacemark).then((r) => ($positionTo.address = r.address));
					});
					break;
			}
			geolocation = ymaps.geolocation;
			geolocation
				.get({
					provider: 'yandex',
					mapStateAutoApply: true
				})
				.then((result) => {
					// Красным цветом пометим положение, вычисленное через ip.
					result.geoObjects.options.set('preset', 'islands#redCircleIcon');
					result.geoObjects.get(0).properties.set({
						balloonContentBody: 'Мое местоположение'
					});
					maps.geoObjects.add(result.geoObjects);
				});
		});
	});
</script>

<ComponentAuth>
	<h4 class="my-3">
		{$page.params.direction == 'from' ? 'Откуда забирать товар' : 'Куда доставлять товар'}
	</h4>
	<div class="rounded">
		<div id="map" class="rounded" style="width: 100%; height:80vh" />
	</div>
	<div class="d-flex justify-content-between align-items-center">
		<button
			class="btn btn-dark mt-3 me-1"
			on:click={() => {
				goto('/client/order');
			}}>Подтвердить выбор</button
		>
		<button
			class="btn btn-dark mt-3"
			on:click={() => {
				goto('/client/order');
			}}>Отмена</button
		>
	</div>
</ComponentAuth>
