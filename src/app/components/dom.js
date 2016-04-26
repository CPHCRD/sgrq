export default class Dom {
  constructor() {
    this.mdlElements = {};
    this.patientInputNamesRegExp = new RegExp(/(patient-)(.+)/);
    this.questionnaireInputsRegExp = new RegExp(/(.+)\[(\d+)\]/);

    // Delegate .transition() calls to .animate()
    // if the browser can't do CSS transitions.
    if (!$.support.transition) {
      $.fn.transition = $.fn.animate;
    }
  }

  hideObfuscator() {
    let obfuscator = document.body.querySelector('.mdl-layout__obfuscator.is-visible');
    if (obfuscator) {
      obfuscator.click();
    }
  }

  hideLoader() {
    $('#cover').transition({ opacity: 0, delay: 500 }, () => {
      $('#cover').remove();
    });
  }

  snack(options) {
    app.dom.mdlElements.Snackbar.showSnackbar((typeof options === 'object') ? options : { message: options });
  }  

  getFormattedDate(dateString, format) {
    let dateObject = new Date(dateString);
    let day = dateObject.getDate();
    let month = dateObject.getMonth()+1;
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    return format
      .replace('Y', dateObject.getFullYear())
      .replace('m', month < 10 ? '0' + month : month)
      .replace('d', day < 10 ? '0' + day : day)
      .replace('h', hours < 10 ? '0' + hours : hours)
      .replace('i', minutes < 10 ? '0' + minutes : minutes);
  }

  refreshPatientsList() {
    let html = ``;

    let patients = app.patient.all;
    if (patients.length < 1) {
      this.$patientsList.hide();
      return;
    } else {
      this.$patientsList.show();
    }

    Object.keys(patients).forEach(patientId => {
      let patient = patients[patientId];
      let patientName = patientId !== 'null' ? patientId : 'Unnamed Patient';
      let patientBirth = patient.birth !== null ? this.getFormattedDate(patient.birth, app.config.site.dateFormat) : '';
      let patientGender = patient.gender;
      if (patientGender) {
        patientGender = patientGender === '0' ? app.config.patient.labels.male : app.config.patient.labels.female;
      } else {
        patientGender = '';
      }
      let questionnairesNumber = patient.questionnaires ? Object.keys(patient.questionnaires).length : 0;
      html += `<tr>
        <td class="mdl-data-table__cell--non-numeric">${patientName}</td>
        <td class="mdl-data-table__cell--non-numeric">${patientBirth}</td>
        <td class="mdl-data-table__cell--non-numeric">${patientGender}</td>
        <td class="mdl-data-table__cell--non-numeric">${questionnairesNumber}</td>
        <td class="mdl-data-table__cell--non-numeric">
          <a onClick="(function(){ app.router.go(\'/patient/${patientId}\'); })()">
          <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            view
          </button>
          </a>
        </td>
      </tr>`;
    });

    this.$patientsList.find('tbody').html(html);
  }


  loadPatient(id) {
    let patient = app.patient.all[id];
    if (!patient) {
      app.router.go('/patient');
      return;
    }
    let patientName = patient.id || 'Unnamed Patient';
    let patientNotes = patient.notes || 'identifier';
    let patientBirth = patient.birth ? this.getFormattedDate(patient.birth, app.config.site.dateFormat) : null;
    let patientBirthPart = patientBirth ? `
      <span class="mdl-list__item-secondary-content">
        <span>${patientBirth}</span>
        <span class="mdl-list__item-sub-title">${(app.config.patient.labels.birth)}</span>
      </span>` : '';

    let patientGender = patient.gender;
    if (patientGender) {
      patientGender = patientGender === '0' ? app.config.patient.labels.male : app.config.patient.labels.female;
    }
    let patientGenderPart = patientGender ? `
      <span class="mdl-list__item-secondary-content">
        <span>${patientGender}</span>
        <span class="mdl-list__item-sub-title">${(app.config.patient.labels.gender)}</span>
      </span>` : '';


    // patient info part
    let html = `
      <ul class="mdl-list">
        <li class="mdl-list__item mdl-list__item--two-line">
          <span class="mdl-list__item-primary-content">
            <i class="material-icons mdl-list__item-avatar">person</i>
            <span>${patientName}</span>
            <span class="mdl-list__item-sub-title">${patientNotes}</span>
          </span>
          ${patientBirthPart}
          ${patientGenderPart}
        </li>
      </ul>
      <hr>`;

    this.$patientDetails.html(html);
    let patientQuestionnairesListHtml = this.generateQuestionnairesListHtml(patient.questionnaires);
    this.$patientDetailsQuestionnairesList.find('tbody').html(patientQuestionnairesListHtml);
  }

  generateQuestionnairesListHtml(questionnaires) {
    let html = ``;
    Object.keys(questionnaires)
      .sort(function(a,b){
        var x = questionnaires[a].createdAt.getTime();
        var y = questionnaires[b].createdAt.getTime();
        return x > y ? -1 : x < y ? 1 : 0;
      })
      .forEach(docId => {
        let doc = questionnaires[docId];
        let questionnaireType = app.config.questionnaires[doc.type];
        let patientId = doc.patient.id;
        let patientName = patientId || 'Unnamed Patient';
        let docDate = app.dom.getFormattedDate(doc.createdAt, app.config.site.dateFormat + ' h:i');
        let scores = doc.scores;
        let patientScore = scores.score ? scores.score.toFixed(2) : '<span class="mdl-color-text--red-500">unvalid</span>';

        html += `<tr data-id="${docId}">
          <td class="mdl-data-table__cell--non-numeric">
            <a onClick="(function(){ app.router.go(\'/patient/${patientId}\'); })()">${patientName}</a>
          </td>
          <td class="mdl-data-table__cell--non-numeric">${docDate}</td>
          <td class="mdl-data-table__cell--non-numeric">${questionnaireType.name}</td>
          <td class="mdl-data-table__cell--non-numeric">${patientScore}</td>
          <td class="mdl-data-table__cell--non-numeric">
            <a onClick="(function(){ app.router.go(\'/list/${docId}\'); })()">
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
              view
            </button>
            </a>
            <a onClick="(function(){ app.dom.removeQuestionnaire(\'${docId}\'); })()">
              <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                remove
              </button>
            </a>
          </td>
        </tr>`;
      });
    return html;
  }

  refreshQuestionnairesList(questionnaires) {
    if (questionnaires.length < 1) {
      this.$questionnairesList.hide();
      return;
    } else {
      this.$questionnairesList.show();
    }
    let html = this.generateQuestionnairesListHtml(questionnaires);
    this.$questionnairesList.find('tbody').html(html);
  }

  removeQuestionnaire(id, el) {
    let snackTimeout = 3000;
    let deleteConfirm = true;
    let $listRow = $('.questionnaires-list').find(`tr[data-id="${id}"]`);
    $listRow.fadeOut();
    setTimeout(() => {
      if (deleteConfirm) {
        app.database.remove(id).then(numRemoved => {
          app.questionnaire.remove(id);
        }).catch(err => {
          console.warn(err);
        });
      }
    }, snackTimeout);
    app.dom.snack({
      message: 'Questionnaire deleted.',
      timeout: snackTimeout,
      actionHandler: function() {
        deleteConfirm = false;
        $listRow.show();
      },
      actionText: 'Undo'
    });
  }

  loadQuestionnaire(id) {
    let doc = app.questionnaire.all[id];
    if (!doc) {
      app.router.go('/list');
      return;
    }
    this.$questionnairePage.find('h1').html(app.config.questionnaires[doc.type].name + ' ' + app.config.listOne.title);
    let patientName = doc.patient.id || 'Unnamed Patient';
    let patientNotes = doc.patient.notes || 'identifier';
    let patientBirth = doc.patient.birth ? this.getFormattedDate(doc.patient.birth, app.config.site.dateFormat) : null;

    let patientBirthPart = patientBirth ? `
      <span class="mdl-list__item-secondary-content">
        <span>${patientBirth}</span>
        <span class="mdl-list__item-sub-title">${(app.config.patient.labels.birth)}</span>
      </span>` : '';

    let patientGender = doc.patient.gender;
    if (patientGender) {
      patientGender = patientGender === '0' ? app.config.patient.labels.male : app.config.patient.labels.female;
    }
    let patientGenderPart = patientGender ? `
      <span class="mdl-list__item-secondary-content">
        <span>${patientGender}</span>
        <span class="mdl-list__item-sub-title">${(app.config.patient.labels.gender)}</span>
      </span>` : '';

    let docDate = this.getFormattedDate(doc.createdAt, app.config.site.dateFormat + ' h:i');

    // patient info part
    let html = `<div class="questionnaire-date"><i class="material-icons">today</i><span>${docDate}</span></div>
      <ul class="mdl-list">
        <li class="mdl-list__item mdl-list__item--two-line">
          <span class="mdl-list__item-primary-content">
            <i class="material-icons mdl-list__item-avatar">person</i>
            <span>${patientName}</span>
            <span class="mdl-list__item-sub-title">${patientNotes}</span>
          </span>
          ${patientBirthPart}
          ${patientGenderPart}
        </li>
      </ul>
      <hr>`;

    // scores part
    let scores = doc.scores;
    let scoreParts = ``;
    for (var key in scores.categories) {
      let scoreCategory = scores.categories[key];
      if (!scoreCategory.valid) {
        scoreParts += `
          <span class="mdl-list__item-secondary-content mdl-color-text--red-500">
            <span>unvalid</span>
            <span class="mdl-list__item-sub-title">${(app.config.questionnaires[doc.type].categories[key].name)}</span>
            <span class="mdl-list__item-sub-title">${scoreCategory.unanswered} unanswered</span>
          </span>`;
      } else {
        scoreParts += `
          <span class="mdl-list__item-secondary-content">
            <span>${scoreCategory.score.toFixed(2)}</span>
            <span class="mdl-list__item-sub-title">${(app.config.questionnaires[doc.type].categories[key].name)}</span>
            <span class="mdl-list__item-sub-title">${scoreCategory.answeredWeight.toFixed(2)} / ${scoreCategory.totalWeight.toFixed(2)}</span>
          </span>`;
      }
    }
    html += `
      <ul class="mdl-list">
        <li class="mdl-list__item mdl-list__item--two-line">`;
    if (!scores.valid) {
      html += `
            <span class="mdl-list__item-primary-content mdl-color-text--red-500">
              <i class="material-icons mdl-list__item-avatar">error</i>
              <span>unvalid</span>
              <span class="mdl-list__item-sub-title">${scores.unanswered} unanswered</span>
            </span>`;
    } else {
      html += `
            <span class="mdl-list__item-primary-content">
              <i class="material-icons mdl-list__item-avatar">star</i>
              <span>${scores.score.toFixed(2)}</span>
              <span class="mdl-list__item-sub-title">${(app.config.patient.labels.total)}</span>
              <span class="mdl-list__item-sub-title">${(scores.answeredWeight.toFixed(2))} / ${(scores.totalWeight.toFixed(2))}</span>
            </span>`;
    }
    html += `         
          </span>
          ${scoreParts}
        </li>
      </ul>`;

    // answers part
    let questionnaireId = doc.type;
    let questions = app.config.questionnaires[questionnaireId].questions;
    let answers = doc.answers;
    let questionsAnswersInfo = app.questionnaire.getQuestionsAnswersInfo({ questions, answers });

    Object.keys(app.config.questionnaires[questionnaireId].categories).forEach(categoryId => {
      let category = app.config.questionnaires[doc.type].categories[categoryId];
      html += `<hr><h4>${category.name}</h4>
          <ul class="mdl-list">`;

      Object.keys(answers).forEach(answerId => {
        let answer = questionsAnswersInfo[answerId].answer;
        let question = questionsAnswersInfo[answerId].question;
        if (question.category !== categoryId) {
          return;
        }
        let answerNumberHTML = String.fromCharCode(97 + parseInt(answer.number));
        let answerTextHTML = question.boolean ? `<span class="mdl-list__item-sub-title">${answer.text}</span>` : '';
        let scoreHTML = answer.score == null ? '<i>--</i>' : answer.score;
        let answerHTML = '';

        if (answer.score === null) {
          answerHTML = '<i>no answer</i>';
        } else if (question.boolean) {
          answerHTML = answers[answerId];
        } else {
          answerHTML = `<i class="questionnaire__answer-number">${answerNumberHTML}.</i> ${answer.text}`;
        }
        let questionNumberHTML = question.boolean ? question.number + '.' + (parseInt(answer.id.split('-')[1]) + 1) : question.number;
        
        html += `
          <li class="mdl-list__item mdl-list__item--two-line">
            <div class="mdl-list__item-primary-content">
              <span class="mdl-list__item-sub-title mdl-color-text--primary-dark">${questionNumberHTML}) ${question.q}</span>
              ${answerTextHTML}
              <span>${answerHTML}</span>
            </div>
            <div class="mdl-list__item-secondary-content">
              <span>${scoreHTML}</span>
            </div>
          </li>`;

      });
      html += '</ul>';
    });
    
    this.$questionnaireDetails.html(html);
  }

  showQuestionnaireSelect() {
    $('#questionnaires-type').show();
  }

  hideQuestionnaireSelect() {
    $('#questionnaires-type').hide();
    $('#questionnaires-type').find('option:selected').removeAttr('selected');
    $('#questionnaires-type').find('option').first().attr('selected', 'selected');
  }

  hideQuestionnaireForms() {
    $('#patient-info').hide();
    Object.keys(app.dom.$questionnaireForms).forEach(questionnaireNumber => {
      app.dom.$questionnaireForms[questionnaireNumber].hide();
    });
  }

  showQuestionnaireForm(questionnaireNumber) {
    let $questionnaireForm = app.dom.$questionnaireForms[questionnaireNumber];
    $questionnaireForm.animate({
      height: "toggle"
    }, 500, () => {
      $('input, textarea').val('');
      $('input[type=checkbox], input[type=radio]').prop('checked',false);
      $('label').removeClass('is-dirty').removeClass('is-checked');
      if (!$questionnaireForm.is(':visible')) {
        $questionnaireForm.animate({
          height: "toggle"
        }, 500);
      }
      $('#patient-info').show();
    });
  }

  format(formData) {
    let questions = {};
    let patient = {};
    for (var inputName in formData) {
      let input = formData[inputName];
      if (input.question) {
        // questionnaire
        questions[inputName] = input;
      } else {
        // patient data
        patient[inputName] = input.value || null;
      }
    }

    return { questions, patient };
  }

  compile(formData) {
    let that = this;
    return new Promise((resolve, reject) => {
      let questionnaireType = parseInt(formData.type.value);
      let data = this.format(formData);
      let patientData = {};
      Object.keys(data.patient).map(key => {
        let patientFieldRegExp = that.patientInputNamesRegExp.exec(key);
        if (patientFieldRegExp && patientFieldRegExp[2]) {
          patientData[patientFieldRegExp[2]] = data.patient[key];
        }
      });
      let answersData = {};
      Object.keys(data.questions).map(key => {
        answersData[key] = data.questions[key].answer;
      });
      var newDoc = {
        type: questionnaireType,
        patient: patientData,
        answers: answersData
      };
      app.database.insert(newDoc).then(doc => {
        app.questionnaire.add(doc);
        resolve(doc);
      }).catch(err => {
        reject(err);
      });
    });
  }

  initComponents() {
    // init toasts
    app.dom.mdlElements.Snackbar = document.getElementById('snackbar').MaterialSnackbar;
    // questionnaires parts
    this.questionnaire = document.getElementById('questionnaire');
    this.$questionnaire = $(this.questionnaire);
    this.$questionnaireForms = {};
    $('.questionnaire').each((i, el) => {
      let $el = $(el);
      let questionnaireNumber = $el.attr('data-number');
      if (questionnaireNumber) {
        app.dom.$questionnaireForms[questionnaireNumber] = $el;
      }
    });
    this.questionnairesList = document.getElementById('questionnaires-list');
    this.$questionnairesList = $(this.questionnairesList);
    this.questionnaireDetails = document.getElementById('questionnaire-details');
    this.$questionnaireDetails = $(this.questionnaireDetails);
    this.patientsList = document.getElementById('patients-list');
    this.$patientsList = $(this.patientsList);
    this.patientDetails = document.getElementById('patient-details');
    this.$patientDetails = $(this.patientDetails);
    this.patientDetailsQuestionnairesList = document.getElementById('patient-questionnaires-list');
    this.$patientDetailsQuestionnairesList = $(this.patientDetailsQuestionnairesList);
    this.questionnairePage = document.getElementById('list-one');
    this.$questionnairePage = $(this.questionnairePage);
  }
  
  initEvents() {
    // questionnaires select change
    $('#questionnaires-select').change(e => {
      let questionnaireNumber = $(e.target).val();
      app.dom.hideQuestionnaireForms();
      app.dom.showQuestionnaireForm(questionnaireNumber);
    });

    // questionnaires start button click
    $('#start-new').click(e => {
      e.preventDefault();
      app.dom.showQuestionnaireSelect();
    });
 
    $('#submit-new').click(e => {
      e.preventDefault();
      var formData = {};
      var activeQuestionnaireNumber = $('#questionnaires-select').val();
      this.$questionnaire.find(':input').each((i, el) => {
        let elAttName = el.getAttribute('name');
        if (!elAttName) {
          return;
        }
        let elAttNameRegExp = app.dom.questionnaireInputsRegExp.exec(elAttName);
        if (elAttNameRegExp && elAttNameRegExp[2] !== activeQuestionnaireNumber) {
          return;
        }
        let elName = el.getAttribute('data-id') || elAttName;
        let elType = el.getAttribute('type');
        let elChecked = $(el).prop('checked');
        let elScore = parseFloat(el.getAttribute('data-score'));
        if (!formData[elName]) {
          formData[elName] = {
            category: el.getAttribute('data-category'),
            question: el.getAttribute('data-question'),
            value: el.getAttribute('data-boolean') === 'true' ? elChecked : el.value,
            score: null,
            answer: null
          };
        } else {
          if (elScore > formData[elName].maxScore) {
            formData[elName].maxScore = elScore;
          } 
        }
        switch (elType) {
          case 'checkbox':
          case 'radio':
            if (elChecked) {
              if (el.getAttribute('data-score')) {
                formData[elName].answer = formData[elName].value = el.getAttribute('data-answer');
                formData[elName].score = parseFloat(el.getAttribute('data-score'));
              } else {
                formData[elName].value = el.getAttribute('data-value');
              }
            }
            break;
          default:
            if (el.value && el.value.length > 0) {
              formData[elName].answer = el.getAttribute('data-answer');
            }
            break;
        }
      });
      this.compile(formData).then(doc => {
        app.router.go('/list/' + doc._id);
      }).catch(err => {
        console.warn(err);
      });
    });

    $('.print').click(e => {
      window.print();
    });
  }

  init() {
    return new Promise(resolve => {
      this.initComponents();
      this.initEvents();
      resolve(true);
    });
  }
  
}