var import_app = require("firebase/app");
var import_auth = require("firebase/auth");
var import_database = require("firebase/database");
const firebaseConfig = {
  apiKey: "AIzaSyBHEhtO7AtePj-X045LXPL4XS8AC_FDB2Q",
  authDomain: "sveltetaxi.firebaseapp.com",
  projectId: "sveltetaxi",
  storageBucket: "sveltetaxi.appspot.com",
  messagingSenderId: "824838237845",
  appId: "1:824838237845:web:046341e06e01e72534f59c",
  databaseURL: "https://sveltetaxi-default-rtdb.firebaseio.com/"
};
const app = (0, import_app.initializeApp)(firebaseConfig);
(0, import_auth.getAuth)();
(0, import_database.getDatabase)(app);
