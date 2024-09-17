import test from 'tape';
var $ = window.$ = require('jquery');
import App from '../src/app';
var app = window.app = new App();

test('APP should be instanced correctly', assert => {
  assert.true(app instanceof App, 'app is an instanceof App');
  assert.false(app.running, 'should not be running');
  assert.true(typeof app.config !== 'undefined', 'app has a config object');
  assert.end();
});