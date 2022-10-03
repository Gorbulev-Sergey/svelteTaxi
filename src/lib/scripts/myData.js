import { writable } from 'svelte/store';
import Position from '$lib/models/Position';
import { Route } from '$lib/models/Route';

export let positionFrom = writable(new Position());
export let positionTo = writable(new Position());
export let showOrder = writable('');
export let routeDetails = writable(new Route());
export let backUrl = writable('');
