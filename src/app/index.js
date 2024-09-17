import Router from './components/router.js';
import Dom from './components/dom.js';
import Questionnaire from './components/questionnaire.js';
import Patient from './components/patient.js';
import Database from './components/database.js';
import config from '../index.json';

export default class App {
  constructor() {
    this.running = false;
    this.loadComponents();
  }

  loadComponents() {
    this.config = config;
    this.database = new Database({ 
      filename: './SGRQ-database-v1.db', // db versioning equals major version of the app
      timestampData: true
    });
    this.questionnaire = new Questionnaire(config.questionnaires);
    this.patient = new Patient();
    this.router = new Router();
    this.dom = new Dom();
  }

  run() {
    let appClass = this;
    return new Promise((resolve, reject) => {
      this.database.init().then(docs => {
        return appClass.questionnaire.init(docs);
      }).then(questionnaires => {
        return appClass.patient.init(questionnaires);
      }).then(result => {
        return appClass.dom.init();
      }).then(result => {
        return appClass.router.init();
      }).then(result => {
        appClass.running = true;
        resolve(appClass.running);
      }).catch(err => {
        reject(err);
      });
    });
  }

};