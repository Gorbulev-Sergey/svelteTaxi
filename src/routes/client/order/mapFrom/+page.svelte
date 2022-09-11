<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { positionFrom } from '$lib/scripts/myData';
	import Position from '$lib/Position';

	let myPositionFrom = new Position();
	let currentPosition = [55.76, 37.64];
	let myMap, myPlacemark, geolocation;

	function init() {
		geolocation = ymaps.geolocation;
		myMap = new ymaps.Map(
			'map',
			{
				center: currentPosition,
				zoom: 9
			},
			{
				searchControlProvider: 'yandex#search'
			}
		);

		// Слушаем клик на карте.
		myMap.events.add('click', function (e) {
			let coords = e.get('coords');

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
				myPositionFrom = new Position(
					firstGeoObject.getAddressLine(),
					myPlacemark.geometry.getCoordinates()
				);
			});
		}

		// Сравним положение, вычисленное по ip пользователя и
		// положение, вычисленное средствами браузера.
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
				myMap.geoObjects.add(result.geoObjects);
			});

		// geolocation
		// 	.get({
		// 		provider: 'browser',
		// 		mapStateAutoApply: true
		// 	})
		// 	.then(function (result) {
		// 		// Синим цветом пометим положение, полученное через браузер.
		// 		// Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
		// 		result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
		// 		myMap.geoObjects.add(result.geoObjects);
		// 	});
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

<h4 class="my-3">Откуда забирать товар</h4>
<div class="rounded">
	<div id="map" class="rounded" style="width: 100%; height:80vh" />
</div>

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
		positionFrom.update((v) => new Position());
		goto('/client/order');
	}}>Отмена</button
>
