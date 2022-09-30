import { writable } from 'svelte/store';
import Position from '$lib/models/Position';

export let positionFrom = writable(new Position());
export let positionTo = writable(new Position());
export let MakeOrderShow = writable('');
