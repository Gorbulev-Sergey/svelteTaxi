export class Car {
	constructor(
		brand = null,
		model = null,
		x = null,
		y = null,
		z = null,
		volume = null,
		tonnage = null,
		photo = null,
		dateOfManufacture = new Date(Date.now())
	) {
		this.brand = brand;
		this.model = model;
		this.x = x;
		this.y = y;
		this.z = z;
		this.volume = volume;
		this.tonnage = tonnage;
		this.photo = photo;
		this.dateOfManufacture = `${dateOfManufacture.getFullYear()}-${
			dateOfManufacture.getMonth() + 1
		}-${dateOfManufacture.getDate()}`;
	}
}
