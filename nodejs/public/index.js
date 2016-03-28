angular.module('mainApp', [])
  .controller('MainController', function() {
    var ctrl = this;
    ctrl.currentView = "VIEW";
 
    ctrl.test = function() {
      console.log('hello world');
    };
  });