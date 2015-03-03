'use strict';

angular.module('mathtempoApp').config(function($stateProvider) {
  $stateProvider.state('problems', {
    url: '/problems',
    templateUrl: 'app/problems/problems.html',
    controller: 'ProblemsCtrl'
  }).state('problems-session', {
    url: '/problems/session',
    templateUrl: 'app/problems/problem.html',
    controller: 'ProblemCtrl'
  });
});
