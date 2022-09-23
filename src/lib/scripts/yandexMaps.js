// @ts-nocheck
export function yandexMaps(containerId = 'map', center = [54.516066, 36.244736], zoom = 9) {
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

export function yandexRoute(start, end, trafficJams = true) {
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
