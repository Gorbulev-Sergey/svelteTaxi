<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { positionFrom } from '$lib/scripts/myData';
	import { mapsCreatePlacemark, mapsOnClick, mapsYandex } from '$lib/scripts/mapsYandex';
	import Position from '$lib/models/Position';
	import ComponentAuth from '$lib/components/ComponentAuth.svelte';

	let myPositionFrom = new Position();
	let maps, myPlacemark, geolocation;

	onMount(async () => {
		mapsYandex().then((m) => {
			maps = m;
			positionFrom.subscribe((v) => (myPositionFrom = v));
			myPlacemark = mapsCreatePlacemark(myPositionFrom.coordinates);
			maps.geoObjects.add(myPlacemark);
			mapsOnClick(m, myPlacemark);
			geolocation = ymaps.geolocation;
			geolocation
				.get({
					provider: 'yandex',
					mapStateAutoApply: true
				})
				.then(function (result) {
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
	<h4 class="my-3">Откуда забирать товар</h4>
	<div class="rounded">
		<div id="map" class="rounded" style="width: 100%; height:80vh" />
	</div>

	<div class="d-flex justify-content-between align-items-center">
		<button
			class="btn btn-dark mt-3 me-1"
			on:click={() => {
				positionFrom.update((v) => myPositionFrom);
				goto('/client/order');
			}}>Подтвердить выбор</button
		>
		<button
			class="btn btn-dark mt-3"
			on:click={() => {
				//positionFrom.update((v) => new Position());
				goto('/client/order');
			}}>Отмена</button
		>
	</div>
</ComponentAuth>
