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

export function mapsOnClick(maps, myPlacemark) {
	return new Promise((responce) => {
		let position = new Position();
		// Слушаем клик на карте.
		maps.events.add('click', (e) => {
			let coords = e.get('coords');
			// Если нет – создаем.
			if (!myPlacemark) {
				myPlacemark = mapsCreatePlacemark(coords);
			}
			// Если метка уже создана – просто передвигаем ее.
			else {
				myPlacemark.geometry.setCoordinates(coords);
			}
			maps.geoObjects.add(myPlacemark);
			// Слушаем событие окончания перетаскивания на метке.
			myPlacemark.events.add('dragend', (e) => {
				myPlacemark.geometry.setCoordinates(e.position);
			});
			responce(myPlacemark.geometry.getCoordinates());
		});
	});
}

export function mapsCreatePlacemark(coords) {
	return new ymaps.Placemark(
		coords,
		{
			iconCaption: ''
		},
		{
			preset: 'islands#violetDotIconWithCaption',
			draggable: true
		}
	);
}

export function mapsGetAddress(coords, myPlacemark) {
	return new Promise((responce, reject) => {
		myPlacemark.properties.set('iconCaption', '');
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
			responce(
				new Position(firstGeoObject.getAddressLine(), myPlacemark.geometry.getCoordinates())
			);
		});
	});
}
