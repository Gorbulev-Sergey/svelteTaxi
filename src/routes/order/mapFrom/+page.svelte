<script>
	import ymaps from 'ymaps';
	import { onMount } from 'svelte';

	let map;
	let Moscow = [55.76, 37.64];

	onMount(() => {
		ymaps
			.load(
				'https://api-maps.yandex.ru/2.1/??lang=ru_RU&amp;apikey=03fbdf33-aae8-4805-810c-47750f27261b'
			)
			.then((maps) => {
				map = new maps.Map('map', {
					center: Moscow,
					zoom: 16
				});
				map.geoObjects.add(new maps.Placemark(Moscow));
			});
	});
</script>

<h4 class="my-3">Откуда забирать товар</h4>
<div class="rounded">
	<div id="map" class="rounded" style="width: 100%; height:80vh" />
</div>
