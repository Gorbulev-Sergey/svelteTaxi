<script>
	import ymaps from 'ymaps';
	import { onMount } from 'svelte';

	let map;
	let Moscow = [55.76, 37.64];

	onMount(() => {
		ymaps
			.load(
				'https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=6ec0afed-fec6-4692-9209-dff04d4f7edd'
			)
			.then((maps) => {
				map = new maps.Map('map', {
					center: Moscow,
					zoom: 16
				});
			});
	});
</script>

<h4 class="mt-3">Выберите адрес доставки</h4>
<div id="map" style="width: 100%; height:100%" />
