import test from 'tape';
import Questionnaire from '../src/app/components/questionnaire.js';
import config from '../src/index.json';

// dummy data
var docs = JSON.parse('[{"type":1,"patient":{"id":null,"birth":null,"gender":null,"notes":null},"answers":{"1":"0","2":"1","3":"2","4":"3","5":"2","6":"0","7":"0","8":"0","14":"0","9-0":"false","9-1":"false","9-2":"false","9-3":"false","9-4":"false","10-0":"true","10-1":"true","10-2":"true","10-3":"true","10-4":"true","10-5":"true","11-0":"false","11-1":"false","11-2":"false","11-3":"true","11-4":"true","11-5":"true","11-6":"true","12-0":"true","12-1":"true","12-2":"true","12-3":"true","12-4":"true","12-5":"false","12-6":"false","12-7":"false","13-0":"true","13-1":"true","13-2":"false","13-3":"false","13-4":"false"},"_id":"2OIobg3gY7bITpZE","createdAt":"2016-04-24T09:51:49.884Z","updatedAt":"2016-04-24T09:51:49.884Z"},{"type":1,"patient":{"id":null,"birth":null,"gender":"1","notes":null},"answers":{"1":"3","2":"3","3":"2","4":"4","5":"2","6":"3","7":"1","8":"2","14":"3","9-0":"false","9-1":"false","9-2":"false","9-3":"false","9-4":"false","10-0":"false","10-1":"false","10-2":"false","10-3":"false","10-4":"false","10-5":"false","11-0":"false","11-1":"false","11-2":"false","11-3":"false","11-4":"false","11-5":"false","11-6":"false","12-0":"false","12-1":"false","12-2":"false","12-3":"false","12-4":"false","12-5":"false","12-6":"false","12-7":"false","13-0":"false","13-1":"false","13-2":"false","13-3":"false","13-4":"false"},"_id":"R2Vqi5fp19cogoDr","createdAt":"2016-04-26T18:31:40.911Z","updatedAt":"2016-04-26T18:31:40.911Z"},{"type":0,"patient":{"id":"sda","birth":null,"gender":null,"notes":null},"answers":{"1":null,"2":null,"3":null,"4":null,"5":null,"6":null,"7":null,"8":null,"9":null,"10":null,"17":null,"11-0":null,"11-1":null,"11-2":null,"11-3":null,"11-4":null,"11-5":null,"11-6":null,"12-0":null,"12-1":null,"12-2":null,"12-3":null,"12-4":null,"12-5":null,"13-0":null,"13-1":null,"13-2":null,"13-3":null,"13-4":null,"13-5":null,"13-6":null,"13-7":null,"14-0":null,"14-1":null,"14-2":null,"14-3":null,"15-0":null,"15-1":null,"15-2":null,"15-3":null,"15-4":null,"15-5":null,"15-6":null,"15-7":null,"15-8":null,"16-0":null,"16-1":null,"16-2":null,"16-3":null,"16-4":null},"_id":"VAE98FLcYojyUujm","createdAt":"2016-04-26T18:25:47.474Z","updatedAt":"2016-04-26T18:25:47.474Z"}]');

test('APP.QUESTIONNAIRE should load correctly', assert => {
  var component = new Questionnaire(config.questionnaires);

  component.init(docs).then(result => {
    assert.equal(typeof result, 'object', 'init should return an object');
    assert.end();
  }).catch(err => {
    console.warn(err);
    assert.end();
  });
});

test('APP.QUESTIONNAIRE should store/unstore questionnaires by id', assert => {
  var component = new Questionnaire(config.questionnaires);
  var doc = docs[0];

  assert.equal(typeof component.all[doc._id], 'undefined', 'should not be stored');
  component.add(doc);
  assert.equal(component.all[doc._id], doc, 'add should have stored our doc');
  component.remove(doc._id);
  assert.equal(typeof component.all[doc._id], 'undefined', 'remove should have unstored our doc');
  assert.end();
});

test('APP.QUESTIONNAIRE should calculate scores correctly', assert => {
  var component = new Questionnaire(config.questionnaires);
  var doc = docs[0];
  var score = component.calculateScore(doc);
  
  assert.true(typeof score !== 'undefined', 'calculateScore should return an object');
  assert.true(typeof score.valid === 'boolean', 'calculateScore should have a boolean attribute named valid');
  assert.true(typeof score.score === 'number', 'calculateScore should have a number attribute named score');

  var categoriesTotal = 0;
  var categoriesScore = 0;
  var categoriesTotalWeight = 0;
  var categoriesAnsweredWeight = 0;
  Object.keys(score.categories).forEach(key => {
    var categoryScore = score.categories[key];
    categoriesScore += categoryScore.score;
    categoriesAnsweredWeight += categoryScore.answeredWeight;
    categoriesTotalWeight += categoryScore.totalWeight;
    categoriesTotal += categoryScore.total;
    assert.equal((categoryScore.unanswered + categoryScore.answered), categoryScore.total, 'calculateScore should calculate the total number of answers per category');
    assert.true((categoryScore.answeredWeight <= categoryScore.totalWeight), 'calculateScore answers weight should be equal or less than maximum total weight');
  });

  assert.equal(categoriesTotal, score.total, 'calculateScore should provide the total number of answers');
  assert.equal(categoriesTotalWeight, score.totalWeight, 'calculateScore should provide the sum of the total weights');
  assert.equal(categoriesAnsweredWeight, score.answeredWeight, 'calculateScore should provide the sum of the answered weights');

  var totalScore = (100 * categoriesAnsweredWeight) / categoriesTotalWeight;
  assert.equal(totalScore, score.score, 'calculateScore should calculate the total score');
  assert.true(score.valid, 'calculateScore should be valid');
  assert.end();
});

test('APP.QUESTIONNAIRE should calculate validity correctly', assert => {
  var component = new Questionnaire(config.questionnaires);
  var doc = docs[2]; // not valid score
  var score = component.calculateScore(doc);
  Object.keys(score.categories).forEach(key => {
    var categoryScore = score.categories[key];
    assert.equal(categoryScore.valid, categoryScore.unanswered <= component.config[doc.type].categories[key].maxAnswersMissing, 'calculateScore should be not valid if unaswnered are more than allowed #' + key);
    assert.false(categoryScore.valid, 'calculateScore should be not valid #' + key);
  });
  assert.false(score.valid, 'calculateScore should be not globally valid');
  assert.end();
});
