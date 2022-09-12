import Position from '$lib/Position';
import { writable } from 'svelte/store';

export let positionFrom = writable(new Position());
export let positionTo = writable(new Position());
export let MakeOrderShow = writable('');
