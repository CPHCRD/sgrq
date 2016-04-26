var Datastore = require('nedb');

export default class Database {
  constructor(options) {
    this.db = new Datastore(options);
  }

  insert(doc) {
    return new Promise((resolve, reject) => {
      this.db.insert(doc, (err, newDoc) => {
        if (err) {
          reject(err);
        }
        resolve(newDoc);
      });
    });
  }

  remove(docId) {
    return new Promise((resolve, reject) => { 
      this.db.remove({ _id: docId }, {}, (err, numRemoved) => {
        if (err) {
          reject(err);
        }
        resolve(numRemoved);
      });
    });
  }

  update(docId, newDoc) {
    return new Promise((resolve, reject) => {
      this.db.update({ _id: docId }, newDoc, {}, (err, numReplaced) => {
        if (err) {
          reject(err);
        }
        resolve(numReplaced);
      });
    });
  }
  
  findOne(docId) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ _id: docId }, (err, doc) => {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }
  
  find(options = {}) {
    return new Promise((resolve, reject) => {
      this.db.find(options).exec((err, docs) => {
        if (err) {
          reject(err);
        }
        resolve(docs);
      });
    });
  }

  init() {
    return new Promise((resolve, reject) => {
      this.db.loadDatabase((err) => {
        if (err) {
          console.warn(err);
          return;
        }
        this.find().then((docs) => {
          resolve(docs);
        }).catch((err) => {
          reject(err);
        });
      });
    });
  }
}