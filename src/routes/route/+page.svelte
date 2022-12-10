<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ComponentAuth from '$lib/components/ComponentAuth.svelte';
	import { mapsRoute, mapsYandex } from '$lib/scripts/mapsYandex';
	import { backUrl, positionTo, routeDetails } from '$lib/scripts/myData';
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
			<button
				class="btn btn-dark mt-3 me-1"
				on:click={() => {
					// Функция вызываемая в нашем андройд приложении клиент
					jsInterface.startNavigator(
						$routeDetails.positionTo.coordinates[0],
						$routeDetails.positionTo.coordinates[1]
					);
				}}>Открыть в навигаторе</button
			>
			<button
				class="btn btn-dark mt-3"
				on:click={() => {
					goto($backUrl);
				}}>Назад</button
			>
		</div>
	</div>
</ComponentAuth>

<!-- <a
	href="https://yandex.ru/navi/?from=tabbar&ll=36.050897%2C54.470741&mode=routes&rtext=54.389394%2C35.739075~54.469369%2C36.039609~54.518168%2C36.251009&rtt=auto&ruri=~~ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoxOTMwMDk5MDIxEjnQoNC%2B0YHRgdC40Y8sINCa0LDQu9GD0LPQsCwg0YPQu9C40YbQsCDQoNGL0LvQtdC10LLQsCwgMTgiCg1MARFCFWsSWkI%3D&source=serp_navig&utm_medium=mapframe&utm_source=maps&z=13.06"
	style="color:#eee;font-size:12px;position:absolute;top:14px;">Яндекс Карты</a
> -->
