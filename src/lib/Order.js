import Position from '$lib/Position';

export default class Order {
	constructor() {
		this.positionFrom = new Position();
		this.positionTo = new Position();
		this.goods = null;
		this.car = null;
		this.dateOrderCreated = new Date().toLocaleDateString();
		this.dateOfDelivery = new Date().toLocaleDateString();
		this.driverUid = null;
		this.clientUid = null;
	}
}
