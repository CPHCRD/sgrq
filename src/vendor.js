// Polyfills
import 'babel-polyfill';
window.dialogPolyfill = require('dialog-polyfill');
// Other vendors for example jQuery or Lodash
window.$ = require('jquery');
import 'nedb';
import './vendor/routie.js';
// Styles
import 'material-design-lite';
require("!style!css!sass!./scss/style.scss");