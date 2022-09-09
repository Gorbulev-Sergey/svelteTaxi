<script>
	import { goto } from '$app/navigation';
	import { positionTo } from '$lib/components/MyData';
	import Position from '$lib/Position';

	// @ts-nocheck

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let Moscow = [55.76, 37.64];
	let myPlacemark;
	let myPositionTo = new Position();

	function init() {
		var myPlacemark,
			myMap = new ymaps.Map(
				'map',
				{
					center: [55.753994, 37.622093],
					zoom: 9
				},
				{
					searchControlProvider: 'yandex#search'
				}
			);

		// Слушаем клик на карте.
		myMap.events.add('click', function (e) {
			var coords = e.get('coords');

			// Если метка уже создана – просто передвигаем ее.
			if (myPlacemark) {
				myPlacemark.geometry.setCoordinates(coords);
			}
			// Если нет – создаем.
			else {
				myPlacemark = createPlacemark(coords);
				myMap.geoObjects.add(myPlacemark);
				// Слушаем событие окончания перетаскивания на метке.
				myPlacemark.events.add('dragend', function () {
					getAddress(myPlacemark.geometry.getCoordinates());
				});
			}
			getAddress(coords);
		});

		// Создание метки.
		function createPlacemark(coords) {
			return new ymaps.Placemark(
				coords,
				{
					iconCaption: 'поиск...'
				},
				{
					preset: 'islands#violetDotIconWithCaption',
					draggable: true
				}
			);
		}

		// Определяем адрес по координатам (обратное геокодирование).
		function getAddress(coords) {
			myPlacemark.properties.set('iconCaption', 'поиск...');
			ymaps.geocode(coords).then(function (res) {
				var firstGeoObject = res.geoObjects.get(0);

				myPlacemark.properties.set({
					// Формируем строку с данными об объекте.
					iconCaption: [
						// Название населенного пункта или вышестоящее административно-территориальное образование.
						firstGeoObject.getLocalities().length
							? firstGeoObject.getLocalities()
							: firstGeoObject.getAdministrativeAreas(),
						// Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
						firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
					]
						.filter(Boolean)
						.join(', '),
					// В качестве контента балуна задаем строку с адресом объекта.
					balloonContent: firstGeoObject.getAddressLine()
				});
				myPositionTo = new Position(
					firstGeoObject.getAddressLine(),
					myPlacemark.geometry.getCoordinates()
				);
			});
		}
	}

	onMount(() => {
		// @ts-ignore
		ymaps.ready(init);
	});
</script>

<svelte:head>
	<script
		src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=03fbdf33-aae8-4805-810c-47750f27261b"
		type="text/javascript"></script>
</svelte:head>

<h4 class="my-3">Куда везти товар</h4>
<div class="rounded">
	<div id="map" class="rounded" style="width: 100%; height:80vh" />
</div>
<button
	class="btn btn-dark mt-3"
	on:click={() => {
		positionTo.update((v) => myPositionTo);
		goto('/order');
	}}>Подтвердить выбор</button
>
