import App from './app';

// instantiate app when document is ready
var app = window.app = new App();

$(document).ready(() => {
  // launch the app
  app.run().then(result => {
    // result === true
    if (!window.location.hash[0] || window.location.hash[0] !== '#') {
      app.router.go('/');
    }
    app.dom.hideLoader();
  }).catch(err => {
    console.warn(err);
  });

});