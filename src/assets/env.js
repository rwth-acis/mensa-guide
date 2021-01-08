//get the environment variables from Dockerfile

(function (window) {
  window['env'] = window['env'] || {};
  // Environment variables
  window.window['env']['apiUrl'] = 'http://127.0.0.1:8080';
  window['env']['debug'] = true;
})(this);
