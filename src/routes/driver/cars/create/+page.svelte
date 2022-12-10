<script>
	import ComponentTitle from '$lib/components/ComponentTitle.svelte';
	import { Car } from '$lib/models/Car';
	import { db } from '$lib/scripts/firebase';
	import { push, ref } from 'firebase/database';

	let car = new Car();
</script>

<ComponentTitle title="Добавить автомобиль">
	<button
		class="btn btn-dark text-light"
		on:click={() => {
			push(ref(db, '/cars'), car);
			car = new Car();
		}}>Добавить</button
	>
</ComponentTitle>

<div class="row">
	<div class="col-md-8">
		<input class="form-control mb-2" bind:value={car.brand} placeholder="марка" />
		<input class="form-control mb-2" bind:value={car.model} placeholder="модель" />
		<input class="form-control mb-2" bind:value={car.volume} placeholder="объём" />
		<input class="form-control mb-2" bind:value={car.tonnage} placeholder="грузоподъёмность" />
		<div class="input-group mb-2">
			<span class="input-group-text">дата изготовления</span>
			<input type="date" class="form-control" bind:value={car.dateOfManufacture} />
		</div>
	</div>
	<div class="col-md-4">
		<input class="form-control mb-2" bind:value={car.photo} placeholder="url изображения" />
		<img class="img-fluid" src={car.photo} alt="" />
	</div>
</div>
