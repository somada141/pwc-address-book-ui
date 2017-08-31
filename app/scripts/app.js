'use strict';

/**
 * @ngdoc overview
 * @name pwcui
 * @description
 * # pwcui
 *
 * Main module of the application.
 */
angular
  .module('pwcui', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'angularFileUpload',
    'ui-notification'
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
  });

