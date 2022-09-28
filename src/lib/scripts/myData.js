import Position from '$lib/models/Position';
import { writable } from 'svelte/store';

export let positionFrom = writable(new Position());
export let positionTo = writable(new Position());
export let MakeOrderShow = writable('');
