import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
const firebaseConfig = {
	apiKey: 'AIzaSyBHEhtO7AtePj-X045LXPL4XS8AC_FDB2Q',
	authDomain: 'sveltetaxi.firebaseapp.com',
	projectId: 'sveltetaxi',
	storageBucket: 'sveltetaxi.appspot.com',
	messagingSenderId: '824838237845',
	appId: '1:824838237845:web:046341e06e01e72534f59c',
	databaseURL: 'https://sveltetaxi-default-rtdb.firebaseio.com/'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getDatabase(app);
