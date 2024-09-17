export default class Patient {
  constructor() {
    this._all = [];
  }
  
  groupQuestionnairesByPatientId(questionnaires) {
    let patients = {};
    Object.keys(questionnaires).forEach(docId => {
      let doc = questionnaires[docId];
      let patientId = doc.patient.id;
      let patient = patients[patientId];
      if (!patient) {
        patient = patients[patientId] = doc.patient;
        patient.questionnaires = {};
      }
      patient.questionnaires[docId] = doc;
    });
    return patients;
  }

  refreshQuestionnaires(questionnaires) {
    if (questionnaires) {
      this.all = this.groupQuestionnairesByPatientId(questionnaires); 
    }
  }

  get all() {
    return this._all;
  }

  set all(docs) {
    this._all = docs;
  }

  init(questionnaires) {
    this.refreshQuestionnaires(questionnaires);
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
  
}