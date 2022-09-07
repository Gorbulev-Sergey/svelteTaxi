import Position from '$lib/Position';

export default class Order {
	constructor() {
		this.position = new Position();
		this.goods = null;
		this.car = null;
		this.dateOrderCreated = new Date().toLocaleDateString();
		this.dateOfDelivery = new Date().toLocaleDateString();
		this.driver = null;
	}
}
