import Position from '$lib/Position';

export default class Order {
	constructor() {
		this.route = {
			positionFrom: new Position(),
			positionTo: new Position(),
			distance: '',
			duration: ''
		};
		this.goods = null;
		this.car = null;
		this.dateOrderCreated = new Date().toLocaleDateString();
		this.dateOfDelivery = new Date().toLocaleDateString();
		this.driver = null;
		this.client = null;
		this.status = null;
	}
}
