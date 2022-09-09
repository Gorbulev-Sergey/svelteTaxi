var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stdin_exports = {};
__export(stdin_exports, {
  default: () => Page
});
module.exports = __toCommonJS(stdin_exports);
var import_chunks = require("../../../../chunks/index.js");
var import_firebase = require("../../../../chunks/firebase.js");
var import_auth = require("firebase/auth");
var import_database = require("firebase/database");
var import_Driver = require("../../../../chunks/Driver.js");
const Page = (0, import_chunks.c)(($$result, $$props, $$bindings, slots) => {
  let driver = new import_Driver.D();
  return `${`<div class="${"position-fixed mt-3 text-center w-100"}" style="${"left:0"}"><button class="${"btn btn-sm btn-light"}">\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432</button>
		<div class="${"d-flex justify-content-center align-items-center"}" style="${"min-height: 100vh"}"><div class="${"bg-light p-3 rounded text-center"}" style="${"min-width: 470px;"}"><h4 class="${"mb-3"}">\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439</h4>
				<input class="${"form-control mb-3"}" placeholder="${"\u0432\u0430\u0448\u0435 \u0438\u043C\u044F"}"${(0, import_chunks.d)("value", driver.value.name, 0)}>
				<input class="${"form-control mb-3"}" placeholder="${"email"}" type="${"email"}"${(0, import_chunks.d)("value", driver.value.email, 0)}>
				<input class="${"form-control mb-3"}" placeholder="${"\u043F\u0430\u0440\u043E\u043B\u044C"}" type="${"password"}"${(0, import_chunks.d)("value", driver.value.password, 0)}>
				<button class="${"btn btn-dark mb-1"}">\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F</button>
				<br>
				<button class="${"btn btn-sm btn-light "}">\u0423 \u043C\u0435\u043D\u044F \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442</button></div></div></div>`}`;
});
