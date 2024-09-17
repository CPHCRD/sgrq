export default class Questionnaire {
  constructor(config) {
    this._all = {};
    this.config = config;
  }

  checkValidity(questionnaire) {
    let questionnaireConfig = this.config[questionnaire.type];
    if (!questionnaire || !questionnaireConfig) {
      return;
    }
    let validity = {};
    let categoryNoAnswers = {};
    Object.keys(questionnaire.answers).forEach(questionMixedId => {
      let question = this.getQuestionFromMixedId(questionMixedId, questionnaireConfig.questions);
      let categoryId = question.category;
      if (typeof validity[categoryId] === 'undefined') {
        validity[categoryId] = true;
        categoryNoAnswers[categoryId] = 0;
      }
      if (!questionnaire.answers[questionMixedId]) {
        categoryNoAnswers[categoryId]++;
      }
    });
    Object.keys(validity).forEach(categoryId => {
      if (categoryNoAnswers[categoryId] > questionnaireConfig.categories[categoryId].maxAnswersMissing) {
        validity[categoryId] = false;
      }
    });
    return validity;
  }

  getQuestionFromMixedId(mixedId, questions) {
    let question = {};
    if (questions && mixedId) {
      question = questions[mixedId.split('-')[0] - 1];
    }
    return question;
  }

  getQuestionsAnswersInfo(options) {
    let questionsAnswersInfo = {};
    options = JSON.parse(JSON.stringify(options)); // break reference
    let answers = options.answers;
    let questions = options.questions;
    for (var answerId in answers) {
      // get question info
      let question = this.getQuestionFromMixedId(answerId, questions);
      let questionAnswers = question.a.slice(0) || [];
      let answerValue = answers[answerId];
      let answerNumber = answerValue;
      if (question.boolean) {
        answerNumber = parseInt(answerId.split('-')[1]);
      }
      let answer = answerNumber || question.boolean ? questionAnswers[answerNumber] : {};

      if (!answerValue) {
        answer.unanswered = true;
        answer.value = null;
      }
      // get answer score
      let answerScore = 0;
      if (!answerValue) {
        answerScore = null;
      } else if (question.boolean) {
        if (answerValue === 'true') {
          answerScore = answer.score;
        } else if (answerValue === 'false') {
          answerScore = 0;
        }
      } else if (answer) {
        answerScore = answer.score;
      }
      // get answer max score
      let answerMaxScore = 0;
      if (question.boolean) {
        answerMaxScore = questionAnswers[answerId.split('-')[1]].score;
      } else {
        questionAnswers.forEach(a => {
          if (a.score > answerMaxScore) {
            answerMaxScore = a.score;
          }
        });
      }
      // update answer object
      answer.id = answerId;
      answer.value = answerValue;
      answer.number = answerNumber;
      answer.score = answerScore;
      answer.maxScore = answerMaxScore;
      // save object
      questionsAnswersInfo[answerId] = { question, answer };
    }
    return questionsAnswersInfo;
  }

  calculateScore(doc) {
    let validity = this.checkValidity(doc);
    let answers = doc.answers;
    let questionnaireId = doc.type;
    let questions = this.config[questionnaireId].questions.slice();
    let questionsAnswersInfo = this.getQuestionsAnswersInfo({ questions, answers });
    let categoriesScores = {};
    for (var answerId in answers) {
      let answer = questionsAnswersInfo[answerId].answer;
      let question = questionsAnswersInfo[answerId].question;
      let questionCategory = question.category;
      if (typeof categoriesScores[questionCategory] === 'undefined') {
        categoriesScores[questionCategory] = {
          valid: validity[questionCategory],
          answered: 0,
          answeredWeight: 0,
          unanswered: 0,
          unansweredWeight: 0,
          total: 0,
          totalWeight: 0
        };
      }
      categoriesScores[questionCategory].total++;
      if (answer.unanswered) {
        categoriesScores[questionCategory].unanswered++;
        categoriesScores[questionCategory].unansweredWeight += answer.maxScore;
      } else {
        categoriesScores[questionCategory].answered++;
        categoriesScores[questionCategory].answeredWeight += answer.score;
        // consider weight in total score only for answered questions
        categoriesScores[questionCategory].totalWeight += answer.maxScore;
      }
      categoriesScores[questionCategory].score = categoriesScores[questionCategory].totalWeight > 0 ?
        (100 * categoriesScores[questionCategory].answeredWeight) / categoriesScores[questionCategory].totalWeight : 0;
    }
    let score = {
      valid: true,
      score: 0,
      answered: 0,
      answeredWeight: 0,
      unanswered: 0,
      unansweredWeight: 0,
      total: 0,
      totalWeight: 0,
      categories: categoriesScores
    };
    let categoriesValidityCount = 0;
    for (var categoryId in categoriesScores) {
      let categoryScore = categoriesScores[categoryId];
      if (categoryScore.valid) {
        categoriesValidityCount++;
        score.answeredWeight += categoryScore.answeredWeight;
        score.totalWeight += categoryScore.totalWeight;
      }
      score.answered += categoryScore.answered;
      score.total += categoryScore.total;
      score.unanswered += categoryScore.unanswered;
      score.unansweredWeight += categoryScore.unansweredWeight;
    }
    if (categoriesValidityCount < Object.keys(categoriesScores).length) {
      score.valid = false;
    }
    score.score = score.totalWeight > 0 ? (100 * score.answeredWeight) / score.totalWeight : null;
    
    return score;
  }

  add(doc) {
    doc.scores = this.calculateScore(doc);
    this.all[doc._id] = doc;
  }

  remove(docId) {
    delete this.all[docId];
  }

  get all() {
    return this._all;
  }

  set all(docs) {
    let that = this;
    docs.forEach(doc => {
      doc.scores = that.calculateScore(doc);
      this._all[doc._id] = doc;
    });
  }

  init(docs) {
    if (docs) {
      this.all = docs; 
    }
    return new Promise((resolve, reject) => {
      resolve(this.all);
    });
  }
  
}