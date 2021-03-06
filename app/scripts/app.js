'use strict';

/**
 * @ngdoc overview
 * @name pabui
 * @description
 * # pabui
 *
 * Main module of the application.
 */
angular
  .module('pabui', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'angularFileUpload',
    'ui-notification',
    'ngProgress'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).constant('config', {
    pabapi_url: 'http://35.189.142.77:8080'
  });

