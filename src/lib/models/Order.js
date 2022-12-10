import Position from '$lib/models/Position';
import { Route } from './Route';

export default class Order {
	constructor(
		route = new Route(),
		goods = null,
		car = null,
		dateOrderCreated = new Date(Date.now()),
		dateOfDelivery = new Date(Date.now()),
		driver = null,
		client = null,
		status = null
	) {
		this.route = route;
		this.goods = goods;
		this.car = car;
		this.dateOrderCreated = `${dateOrderCreated.getFullYear()}-${
			dateOrderCreated.getMonth() + 1
		}-${dateOrderCreated.getDate()}`;
		this.dateOfDelivery = `${dateOfDelivery.getFullYear()}-${
			dateOfDelivery.getMonth() + 1
		}-${dateOfDelivery.getDate()}`;
		this.driver = driver;
		this.client = client;
		this.status = status;
	}
}
