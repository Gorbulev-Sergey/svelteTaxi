import Position from '$lib/Position';
import { Route } from './Route';

export default class Order {
	constructor(
		route = new Route(),
		goods = null,
		car = null,
		dateOrderCreated = new Date().toLocaleDateString(),
		dateOfDelivery = new Date().toLocaleDateString(),
		driver = null,
		client = null,
		status = null
	) {
		this.route = route;
		this.goods = goods;
		this.car = car;
		this.dateOrderCreated = dateOrderCreated;
		this.dateOfDelivery = dateOfDelivery;
		this.driver = driver;
		this.client = client;
		this.status = status;
	}
}
