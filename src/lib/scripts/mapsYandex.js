// @ts-nocheck
import Position from '$lib/models/Position';

export function mapsYandex(containerId = 'map', center = [54.516066, 36.244736], zoom = 9) {
	return new Promise(function (resolve, reject) {
		ymaps.ready(() => {
			let myMap = new ymaps.Map(
				containerId,
				{
					center: center,
					zoom: zoom
				},
				{
					searchControlProvider: 'yandex#search'
				}
			);
			resolve(myMap);
		});
	});
}

export function mapsRoute(coords, callback, trafficJams = true) {
	ymaps.ready(() => {
		// Создание экземпляра маршрута.
		let route = new ymaps.multiRouter.MultiRoute(
			{
				// Точки маршрута. Обязательное поле.
				referencePoints: coords,
				// Выбор маршрута с учётом пробок
				params: {
					avoidTrafficJams: trafficJams
				}
			},
			{
				// Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
				boundsAutoApply: true
			}
		);
		callback(route);
	});
}

export function mapsCreatePlacemark(coords, baloon = '') {
	return new ymaps.Placemark(
		coords,
		{
			iconCaption: baloon,
			balloonContent: baloon
		},
		{
			preset: 'islands#violetDotIconWithCaption',
			draggable: true
		}
	);
}

export function mapsOnClick(maps, placemark, callback) {
	maps.events.add('click', (e) => {
		let coords = e.get('coords');
		placemark.geometry.setCoordinates(coords);
		mapsGetAddress(placemark, (p) => callback(p));
	});
}

export function mapsOnDragend(placemark, callback) {
	placemark.events.add('dragend', (e) => {
		let coords = e.get('coords');
		placemark.geometry.setCoordinates(coords);
		mapsGetAddress(placemark, (p) => callback(p));
	});
}

export function mapsGetAddress(placemark, callback) {
	ymaps.geocode(placemark.geometry.getCoordinates()).then(function (res) {
		var firstGeoObject = res.geoObjects.get(0);
		placemark.properties.set({
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
		callback(new Position(firstGeoObject.getAddressLine(), placemark.geometry.getCoordinates()));
	});
}
