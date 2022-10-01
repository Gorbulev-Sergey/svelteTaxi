// @ts-nocheck
import Position from '$lib/models/Position';
import { Route } from '$lib/models/Route';

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

export function mapsRoute(start, end, trafficJams = true) {
	// Создание экземпляра маршрута.
	let route = new ymaps.multiRouter.MultiRoute(
		{
			// Точки маршрута. Обязательное поле.
			referencePoints: [start, end],
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
	return route;
}

export function mapsGetRouteData(route, callback) {
	// Подписка на событие обновления данных маршрута.
	// Обратите внимание, подписка осуществляется для поля model.
	route.model.events.add('requestsuccess', () => {
		// Получение ссылки на активный маршрут и вывод информации о маршруте.
		let data = {
			distance: route.getActiveRoute().properties.get('distance').text,
			duration: route.getActiveRoute().properties.get('duration').text
		};
		callback(data);
	});
}

export function mapsCreatePlacemark(coords) {
	let placemark = new ymaps.Placemark(
		coords,
		{},
		{
			preset: 'islands#violetDotIconWithCaption',
			draggable: true
		}
	);
	mapsGetAddress(placemark, () => {});
	return placemark;
}

export function mapsOnClick(maps, placemark, callback) {
	maps.events.add('click', (e) => {
		let coords = e.get('coords');
		placemark.geometry.setCoordinates(coords);
		mapsGetAddress(placemark, (p) => callback(p));
	});
}

export function mapsOnDragend(placemark, callback) {
	placemark.events.add('dragend', () => {
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
