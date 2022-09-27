import Position from './Position';
export class Route {
	constructor(
		positionFrom = new Position(),
		positionTo = new Position(),
		distance = null,
		duration = null
	) {
		this.positionFrom = positionFrom;
		this.positionTo = positionTo;
		this.distance = distance;
		this.duration = duration;
	}
}
