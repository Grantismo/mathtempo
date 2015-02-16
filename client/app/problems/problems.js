'use strict';

angular.module('mathtempoApp').config(function($stateProvider) {
  $stateProvider.state('problems', {
    url: '/problems',
    templateUrl: 'app/problems/problems.html',
    controller: 'ProblemsCtrl'
  }).state('problems-next', {
    url: '/problems/next',
    controller: 'NextProblemCtrl'
  }).state('problems-detail', {
    url: '/problems/:id',
    templateUrl: 'app/problems/problem.html',
    controller: 'ProblemCtrl'
  });
});
