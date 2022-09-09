<script>
	// @ts-nocheck

	import ymaps from 'ymaps';
	import { onMount } from 'svelte';

	let myMap;
	let Moscow = [55.76, 37.64];
	let myPlacemark;

	onMount(() => {
		ymaps
			.load(
				'https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=03fbdf33-aae8-4805-810c-47750f27261b'
			)
			.then((maps) => {
				myMap = new maps.Map(
					'map',
					{
						center: Moscow,
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
					});
				}
			});
	});
</script>

<h4 class="my-3">Откуда забирать товар</h4>
<div class="rounded">
	<div id="map" class="rounded" style="width: 100%; height:80vh" />
</div>
