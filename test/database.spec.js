import test from 'tape';
import Database from '../src/app/components/database.js';

var dbOptions = { 
  timestampData: true,
  inMemoryOnly: true // for testing purpose
};

test('APP.DATABASE should load correctly', assert => {
  var component = new Database(dbOptions);

  component.init().then(result => {
    assert.equal(typeof result.length, 'number', 'database should return an array');
    assert.equal(typeof result, 'object', 'database init should return docs');
    assert.end();
  }).catch(err => {
    assert.equal(err, null, 'database init should not return errors');
    console.warn(err);
    assert.end();
  });
});

test('APP.DATABASE should store docs', assert => {
  var component = new Database(dbOptions);

  component.init().then(result => {
    return component.insert({
      'foo': 'bar',
      'baz': 1
    });
  }).then(doc => {
    assert.equal(typeof doc, 'object', 'insert should return an object');
    assert.equal(doc.foo, 'bar', 'insert should return the correct object');
    assert.equal(typeof doc._id, 'string', 'insert should return the correct object with an _id');
    return component.insert({
      'foo': 'bar',
      'baz': 2
    });
  }).then(doc => {
    assert.equal(typeof doc, 'object', 'next insert should return an object');
    assert.equal(doc.baz, 2, 'next insert should return the correct object');
    assert.end();
  }).catch(err => {
    assert.equal(err, null, 'database insert should not return errors');
    console.warn(err);
    assert.end();
  });
});

test('APP.DATABASE should updated docs', assert => {
  var component = new Database(dbOptions);
  var item = null;

  component.init().then(result => {
    return component.insert({
      'foo': 'bar',
      'baz': 3
    });
  }).then(doc => {
    item = doc;
    return component.update(item._id, {
      'foo': 'baz'
    });
  }).then(result => {
    assert.equal(result, 1, 'updated should return the number of item replaced');
    return component.findOne(item._id);
  }).then(result => {
    assert.equal(result.foo, 'baz', 'update should have updated the item attribute');
    assert.equal(typeof result.baz, 'undefined', 'updated should have removed the item attribute');
    assert.end();
  }).catch(err => {
    assert.equal(err, null, 'database update should not return errors');
    console.warn(err);
    assert.end();
  });
});

test('APP.DATABASE should remove docs', assert => {
  var component = new Database(dbOptions);
  var item = null;
  
  component.init().then(result => {
    return component.insert({
      'foo': 'bar',
      'baz': 66
    });
  }).then(doc => {
    item = doc;
    return component.remove(doc._id);
  }).then(result => {
    assert.equal(result, 1, 'remove should return the number of item removed');
    return component.findOne(item._id);
  }).then(result => {
    assert.equal(result, null, 'remove should have removed the item');
    assert.end();
  }).catch(err => {
    assert.equal(err, null, 'database remove should not return errors');
    console.warn(err);
    assert.end();
  });
});