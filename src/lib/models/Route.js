// @ts-nocheck
import Position from './Position';
export class Route {
	constructor(
		positionFrom = new Position(),
		positionTo = new Position(),
		distance = '',
		duration = ''
	) {
		this.positionFrom = positionFrom;
		this.positionTo = positionTo;
		this.distance = distance;
		this.duration = duration;
	}

	// constructor() {
	// 	this.positionFrom = new Position();
	// 	this.positionTo = new Position();
	// 	this.distance = '';
	// 	this.duration = '';
	// }
}
