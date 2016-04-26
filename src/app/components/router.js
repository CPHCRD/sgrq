export default class Router {
  constructor() {
    this.homePath = '/';
    this.previousPath = '';
    this.currentPath = '/';
  }

  init() {
    return new Promise((resolve, reject) => {
      let router = this;
      routie({
        '/': function() {
          router.changePath('/');
          router.changeView('/intro');
        },
        '/new': function() {
          router.changePath(this.path);
          router.changeView(this.path, () => {
            app.dom.hideQuestionnaireSelect();
            app.dom.hideQuestionnaireForms();
          });
        },
        '/list': function() {
          router.changePath(this.path);
          router.changeView(this.path, () => {
            app.dom.refreshQuestionnairesList(app.questionnaire.all);
          });
        },
        '/list/:id': function(id) {
          router.changePath(this.path);
          router.changeView('/list-one', () => {
            app.dom.loadQuestionnaire(id);
            document.querySelector('.mdl-layout__content').scrollTop = 0;
          });
        },
        '/patient': function() {
          router.changePath(this.path);
          router.changeView(this.path, () => {
            app.patient.refreshQuestionnaires(app.questionnaire.all);
            app.dom.refreshPatientsList();
          });
        },
        '/patient/:id': function(id) {
          router.changePath(this.path);
          router.changeView('/patient-one', () => {
            app.patient.refreshQuestionnaires(app.questionnaire.all);
            app.dom.loadPatient(id);
          });
        },
        '/about': function() {
          router.changePath(this.path);
          router.changeView(this.path);
        },
        '/*': function() {
          //catch-all
          router.changePath('/');
          router.changeView('/intro');
        }
      });
      resolve(true);
    });
  }

  go(path) {
    if (path.length > 0) {
      routie(path); 
    }
  }

  callCallback(callback) {
    if (typeof callback == 'function') {
      callback();
    }
  }

  showView(newViewName, callback) {
    let newView = $('#' + newViewName);
    if (newView.length > 0) {
      newView.show().addClass('active-view');
      app.router.callCallback(callback);
    } else {
      this.callCallback(callback);
    }
  }

  hideView(activeViewName, callback) {
    let activeView = $('#' + activeViewName);
    if (activeView.length > 0) {
      activeView.removeClass('active-view').hide();
      app.router.callCallback(callback);
    } else {
      this.callCallback(callback);
    }
  }

  hideCurrentView(callback) {
    let currentView = $('.active-view');
    if (currentView.length > 0) {
      this.hideView(currentView.attr('id'), callback);
    } else {
      this.callCallback(callback);
    }
  }

  changePath(path) {
    this.previousPath = this.currentPath;
    this.currentPath = path;
    app.dom.hideObfuscator();
  }

  changeView(viewName, callback) {
    let containerName = viewName.substring(1).replace(/\//g, '-');
    this.hideCurrentView(() => {
      app.router.showView(containerName, callback);
    });
  }

};
