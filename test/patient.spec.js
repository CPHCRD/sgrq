import test from 'tape';
import Patient from '../src/app/components/patient.js';
import config from '../src/index.json';

// dummy data
var questionnaires = JSON.parse('{"2OIobg3gY7bITpZE":{"type":1,"patient":{"id":null,"birth":null,"gender":null,"notes":null},"answers":{"1":"0","2":"1","3":"2","4":"3","5":"2","6":"0","7":"0","8":"0","14":"0","9-0":"false","9-1":"false","9-2":"false","9-3":"false","9-4":"false","10-0":"true","10-1":"true","10-2":"true","10-3":"true","10-4":"true","10-5":"true","11-0":"false","11-1":"false","11-2":"false","11-3":"true","11-4":"true","11-5":"true","11-6":"true","12-0":"true","12-1":"true","12-2":"true","12-3":"true","12-4":"true","12-5":"false","12-6":"false","12-7":"false","13-0":"true","13-1":"true","13-2":"false","13-3":"false","13-4":"false"},"_id":"2OIobg3gY7bITpZE","createdAt":"2016-04-24T09:51:49.884Z","updatedAt":"2016-04-24T09:51:49.884Z","scores":{"valid":true,"score":52.70308254473907,"answered":40,"answeredWeight":1687.5000000000002,"unanswered":0,"unansweredWeight":0,"total":40,"totalWeight":3201.9,"categories":{"1":{"valid":true,"answered":7,"answeredWeight":257.3,"unanswered":0,"unansweredWeight":0,"total":7,"totalWeight":566.2,"score":45.4433062522077},"2":{"valid":true,"answered":13,"answeredWeight":369.1,"unanswered":0,"unansweredWeight":0,"total":13,"totalWeight":982.9,"score":37.552141621731614},"3":{"valid":true,"answered":20,"answeredWeight":1061.1000000000001,"unanswered":0,"unansweredWeight":0,"total":20,"totalWeight":1652.8000000000002,"score":64.20014520813166}}}},"R2Vqi5fp19cogoDr":{"type":1,"patient":{"id":null,"birth":null,"gender":"1","notes":null},"answers":{"1":"3","2":"3","3":"2","4":"4","5":"2","6":"3","7":"1","8":"2","14":"3","9-0":"false","9-1":"false","9-2":"false","9-3":"false","9-4":"false","10-0":"false","10-1":"false","10-2":"false","10-3":"false","10-4":"false","10-5":"false","11-0":"false","11-1":"false","11-2":"false","11-3":"false","11-4":"false","11-5":"false","11-6":"false","12-0":"false","12-1":"false","12-2":"false","12-3":"false","12-4":"false","12-5":"false","12-6":"false","12-7":"false","13-0":"false","13-1":"false","13-2":"false","13-3":"false","13-4":"false"},"_id":"R2Vqi5fp19cogoDr","createdAt":"2016-04-26T18:31:40.911Z","updatedAt":"2016-04-26T18:31:40.911Z","scores":{"valid":true,"score":4.956432118429682,"answered":40,"answeredWeight":158.7,"unanswered":0,"unansweredWeight":0,"total":40,"totalWeight":3201.9,"categories":{"1":{"valid":true,"answered":7,"answeredWeight":62,"unanswered":0,"unansweredWeight":0,"total":7,"totalWeight":566.2,"score":10.950194277640408},"2":{"valid":true,"answered":13,"answeredWeight":0,"unanswered":0,"unansweredWeight":0,"total":13,"totalWeight":982.9,"score":0},"3":{"valid":true,"answered":20,"answeredWeight":96.7,"unanswered":0,"unansweredWeight":0,"total":20,"totalWeight":1652.8000000000002,"score":5.850677637947724}}}},"VAE98FLcYojyUujm":{"type":0,"patient":{"id":"sda","birth":null,"gender":null,"notes":null},"answers":{"1":null,"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"17":null,"11-0":null,"11-1":null,"11-2":null,"11-3":null,"11-4":null,"11-5":null,"11-6":null,"12-0":null,"12-1":null,"12-2":null,"12-3":null,"12-4":null,"12-5":null,"13-0":null,"13-1":null,"13-2":null,"13-3":null,"13-4":null,"13-5":null,"13-6":null,"13-7":null,"14-0":null,"14-1":null,"14-2":null,"14-3":null,"15-0":null,"15-1":null,"15-2":null,"15-3":null,"15-4":null,"15-5":null,"15-6":null,"15-7":null,"15-8":null,"16-0":null,"16-1":null,"16-2":null,"16-3":null,"16-4":null},"_id":"VAE98FLcYojyUujm","createdAt":"2016-04-26T18:25:47.474Z","updatedAt":"2016-04-26T18:25:47.474Z","scores":{"valid":false,"score":null,"answered":0,"answeredWeight":0,"unanswered":50,"unansweredWeight":3989.4000000000005,"total":50,"totalWeight":0,"categories":{"1":{"valid":false,"answered":0,"answeredWeight":0,"unanswered":8,"unansweredWeight":662.4999999999999,"total":8,"totalWeight":0,"score":0},"2":{"valid":false,"answered":0,"answeredWeight":0,"unanswered":16,"unansweredWeight":1209.1000000000004,"total":16,"totalWeight":0,"score":0},"3":{"valid":false,"answered":0,"answeredWeight":0,"unanswered":26,"unansweredWeight":2117.8,"total":26,"totalWeight":0,"score":0}}}}}');

test('APP.PATIENT should load correctly', assert => {
  var component = new Patient();

  component.init(questionnaires).then(result => {
    assert.equal(result, true, 'init should return true');
    assert.end();
  }).catch(err => {
    assert.equal(err, null, 'init update should not return errors');
    console.warn(err);
    assert.end();
  });
});

test('APP.PATIENT should group questionnaires by the same patient', assert => {
  var component = new Patient();
  var patients = component.groupQuestionnairesByPatientId(questionnaires);

  assert.equal(typeof patients, 'object', 'have created an object');
  var patientsIds = Object.keys(patients);
  var patientId = patientsIds[Math.floor(patientsIds.length * Math.random())];
  assert.equal(String(patientId), String(patients[patientId].id), 'with its id as index');
  assert.equal(typeof patients[patientId].questionnaires, 'object', 'with an object questionnaires');
  var patientQuestionnairesIds = Object.keys(patients[patientId].questionnaires);
  var questionnaireId = patientQuestionnairesIds[Math.floor(patientQuestionnairesIds.length * Math.random())];
  assert.equal(String(patients[patientId].questionnaires[questionnaireId].patient.id), String(patientId), 'with an object questionnaires with him as patient');
  assert.end();
});

test('APP.PATIENT should provide a refresh method', assert => {
  var component = new Patient();
  var patients = component.groupQuestionnairesByPatientId(questionnaires);

  assert.equal(typeof patients, 'object', 'have created an object');
  assert.true(Object.keys(patients).length > 0, 'have populated multiples patients');
  var questionnaireId = Object.keys(questionnaires)[0];
  component.refreshQuestionnaires({
    questionnaireId: questionnaires[questionnaireId]
  });
  assert.equal(typeof component.all, 'object', 'have refreshed the object');
  assert.false(patients == component.all, 'have refreshed the patients using the provided questionnaires');
  assert.end();
});
